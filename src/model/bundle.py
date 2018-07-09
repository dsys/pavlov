from keras import backend as K
from keras.models import load_model, model_from_json
from tensorflow.python.framework import graph_util
from tensorflow.python.saved_model import builder as saved_model_builder
from tensorflow.python.saved_model import tag_constants, signature_constants
from tensorflow.python.saved_model.signature_def_utils_impl import predict_signature_def
import sys
import tensorflow as tf

export_path = sys.argv[1]

gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=0.8, allow_growth=False)
sess = tf.Session(config=tf.ConfigProto(gpu_options=gpu_options))
K.set_session(sess)

print('Loading training model')
training_model = load_model('model.h5')
model_config = training_model.to_json()
model_weights = training_model.get_weights()
classes = open('classes.txt', 'r').read().splitlines()

print('Creating serving model')
K.set_learning_phase(0)
serving_model = model_from_json(model_config)
serving_model.set_weights(model_weights)
image_size = serving_model.input.get_shape().as_list()[1:3]

print('Converting model variables to constants')
model_graph_def = graph_util.convert_variables_to_constants(sess, 
        sess.graph.as_graph_def(),
        [serving_model.output.name.replace(':0', '')])

print('Generating bundled graph')
with tf.Graph().as_default() as bundled_graph:
        input_bytes = tf.placeholder(
                        dtype=tf.string,
                        shape=(None,),
                        name='input_bytes')

        def decode_image_bytes(b):
                png = tf.image.decode_png(b, channels=3)
                return tf.image.convert_image_dtype(png, dtype=tf.float32)

        image_f1 = tf.map_fn(decode_image_bytes, input_bytes, dtype=tf.float32)
        # image_f2 = tf.image.resize_image_with_crop_or_pad(image_f1, image_size[0], image_size[1])
        image_f3 = tf.subtract(image_f1, 0.5)
        image_f4 = tf.scalar_mul(2., image_f3)

        model_output, = tf.import_graph_def(
                        model_graph_def,
                        input_map={serving_model.input.name: image_f4},
                        return_elements=[serving_model.output.name])

        top_indices = tf.argmax(model_output, axis=1)
        output_class = tf.gather(classes, top_indices)
        output_prob = tf.reduce_max(model_output, axis=1)

        inputs = {'input_bytes': input_bytes}
        outputs = {'output_class': output_class, 'output_prob': output_prob}
        signature = predict_signature_def(inputs=inputs, outputs=outputs)

        print('Saving bundled graph to {}'.format(export_path))
        builder = saved_model_builder.SavedModelBuilder(export_path)
        builder.add_meta_graph_and_variables(sess=sess,
                tags=[tag_constants.SERVING],
                signature_def_map={
                signature_constants.DEFAULT_SERVING_SIGNATURE_DEF_KEY: signature})
        builder.save()
