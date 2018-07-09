#! /usr/bin/env python

from keras.preprocessing.image import ImageDataGenerator
from keras.models import Model
from keras import backend as K
from keras.applications.inception_v3 import InceptionV3, preprocess_input
from keras.layers import Dense
from keras.optimizers import SGD
from keras.callbacks import TensorBoard, ModelCheckpoint, ReduceLROnPlateau
import numpy as np
import glob, time
import os, random, pickle

img_width, img_height = 139, 139
bottleneck_epochs = 64
finetune_epochs = 128
batch_size = 128
train_steps = 256
test_steps = 128
positive_weight = 8.
# finetune_freeze_layer = 249

img_size = (img_width, img_height)
classes = os.listdir('data/raw')
classes.sort()
classes.remove('background')
classes.insert(0, 'background')

with open('classes.txt', 'w') as f:
    f.write('\n'.join(classes))

negative_classes = ['background']
positive_classes = classes.copy()
positive_classes.remove('background')

class_counts = {}
for i, k in enumerate(positive_classes):
    class_counts[i + 1] = len(os.listdir('data/raw/' + k))
print('Using class counts {}'.format(class_counts))

max_count = np.max(list(class_counts.values()))
class_weight = dict()
for k in class_counts.keys():
   score = max_count / float(class_counts[k])
   class_weight[k] = score * positive_weight
class_weight[0] = 1.0
print('Using class weight {}'.format(class_weight))

normalized_negative_classes = negative_classes.copy()
for i in range(len(positive_classes)):
    normalized_negative_classes.append('DUMMY ' + str(i))

normalized_positive_classes = positive_classes.copy()
for i in range(len(negative_classes)):
    normalized_positive_classes.insert(0, 'DUMMY ' + str(i))

negative_train_datagen = ImageDataGenerator(
        fill_mode='constant',
        cval=170,
        horizontal_flip=True,
        vertical_flip=True,
        zoom_range=[0.8, 1.3],
        rotation_range=90,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.4)

positive_train_datagen = ImageDataGenerator(
        fill_mode='constant',
        cval=170,
        zoom_range=[0.8, 1.3],
        rotation_range=15,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.1)

test_datagen = ImageDataGenerator(
        fill_mode='constant',
        cval=170,
        zoom_range=[0.8, 1.3],
        rotation_range=15,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.05)

negative_train_flow = negative_train_datagen.flow_from_directory(
        'data/raw',
        target_size=img_size,
        batch_size=batch_size // 2,
        class_mode='categorical',
        classes=normalized_negative_classes)

positive_train_flow = positive_train_datagen.flow_from_directory(
        'data/raw',
        target_size=img_size,
        batch_size=batch_size // 2,
        class_mode='categorical',
        classes=normalized_positive_classes)

negative_test_flow = test_datagen.flow_from_directory(
        'data/raw',
        target_size=img_size,
        batch_size=batch_size // 2,
        class_mode='categorical',
        classes=normalized_negative_classes)

positive_test_flow = test_datagen.flow_from_directory(
        'data/raw',
        target_size=img_size,
        batch_size=batch_size // 2,
        class_mode='categorical',
        classes=normalized_positive_classes)

def gen_mixed_flow(*flows):
    while True:
        gs = [next(f) for f in flows]
        x = np.concatenate([g[0] for g in gs], axis=0)
        y = np.concatenate([g[1] for g in gs], axis=0)
        yield preprocess_input(x), y

train_data = gen_mixed_flow(positive_train_flow, negative_train_flow)
test_data = gen_mixed_flow(positive_test_flow, negative_test_flow)
mcp = ModelCheckpoint(
    'model.h5', save_best_only=True, save_weights_only=False)
tb = TensorBoard(log_dir="logs/final/{}".format(time.time()))
rlr = ReduceLROnPlateau(monitor='val_loss', factor=0.1)

print('Training bottleneck model')
input_shape = (img_width, img_height, 3)
base_model = InceptionV3(input_shape=input_shape, weights='imagenet', include_top=False, pooling='avg')

for layer in base_model.layers:
    layer.trainable = False
base_model.layers[-1].trainable = True

bottleneck = base_model.output
predictions = Dense(len(classes), activation='softmax')(bottleneck)
model = Model(inputs=base_model.input, outputs=predictions)
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.fit_generator(
    train_data,
    steps_per_epoch=train_steps,
    epochs=bottleneck_epochs,
    validation_data=test_data,
    validation_steps=test_steps,
    class_weight=class_weight,
    callbacks=[mcp, tb, rlr])

print('Finetuning model')

# for layer in model.layers[:finetune_freeze_layer]:
#    layer.trainable = False
# for layer in model.layers[finetune_freeze_layer:]:
#    layer.trainable = True

for layer in model.layers:
   layer.trainable = True
model.compile(loss='categorical_crossentropy', optimizer=SGD(lr=0.0001, momentum=0.9), metrics=['accuracy'])

model.fit_generator(
    train_data,
    steps_per_epoch=train_steps,
    epochs=finetune_epochs,
    validation_data=test_data,
    validation_steps=test_steps,
    class_weight=class_weight,
    callbacks=[mcp, tb, rlr])
