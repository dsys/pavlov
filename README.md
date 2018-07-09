<img src="https://raw.githubusercontent.com/dsys/pavlov/master/resources/logo.png" alt="logo" width="320" />

**A state-of-the-art content moderation service**

Use Pavlov to screen images for explicit, malicious, or infringing content. Pavlov is an automation solution that puts you in control of your content moderation process and continuously learns from your feedback.

## Features

* **Automated content moderation** — Use our state of the art computer vision models based on InceptionV3 in addition to Google Cloud Vision to moderate images for malicious content. Use our ready-made models for efficient bootstrapping.
* **Analyst console** — Pavlov features an advanced analyst console for your content reviewers to use out of the box. Approve and deny images right from your browser, no machine learning experience required.
* **Human-in-the-loop annotations** — Hook up Pavlov to your Amazon Mechanical Turk account to automatically process flagged content according to your policies.
* **Perceptual hashing** — Flag content according to your own company guidelines. Pavlov will automatically detect similar-looking images and treat them according to your policy.
* **Highly scalable** — Pavlov uses Google Cloud Functions and AWS Lambdas to automatically scale its image processing pipeline to meet the growing demands of your business. Pavlov can process hundreds of thousands of images per day!
* **Self-hosted** — You can host Pavlov yourself on any Kubernetes cluster using our easy-to-deploy Helm charts.

## Screenshots

<img src="https://raw.githubusercontent.com/dsys/pavlov/master/resources/pavlov-screen-1.png" alt="Pavlov screenshot 1"/>

<img src="https://raw.githubusercontent.com/dsys/pavlov/master/resources/pavlov-screen-2.png" alt="Pavlov screenshot 2"/>

## Development

Take a look at the [docker-compose configuration file](https://github.com/dsys/pavlov/blob/master/docker-compose.yaml) to run the provided services:

    $ docker-compose up -d pavlov

You'll want to migrate the database and initialize the elasticsearch cluster locally. You can find information about how to do that in `src/migrations` and `src/elasticsearch` respectively.

*Better documentation coming soon!*

## License

Apache 2.0
