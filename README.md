# CitationGenerator

## Front-end Stack
- Vue JS
- Gulp

## Backend stack
- Adonis framework
- Node 8.11.1
- AWS Beanstalk

## Run app locally (dev)

- Make sure you have Node > 8.11.1 (check by running `node -v` in terminal)
- Put `.env` and from the `env.sample` the app's directory next to packages.json
- Both `app.yaml` and `env.sample` now reside in the repository, should they be required in the future. (Google Cloud and Local Development)
- Run this on the app's directory: `adonis serve --dev`
- Start gulp (asset compiler): `gulp --watch`
- Visit [http://localhost:3333](http://localhost:3333)


## Deploy the app to server

Install the EB (ElasticBeanstalk CLI): [https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)

- Run `pip install awsebcli --upgrade --user`
- In the app folder, run `eb init`
- It'll ask you to choose a region, choose `us-east-1`
- It'll ask you to create or choose existing app, choose `citationgenerator`
- It may ask to enable CodeCommit, type `n` (we don't use that)
- You're set.
- In the `.ebextensions/` folder reside all the required configurations for running in Beanstalk with Docker on Amazon Linux v2

Deploy (Run from the app's directory):

- Push to Github: `git add .` and `git commit -m 'your comment about what you changed'` then `git push origin master`
- Deploy to AWS: `npm run deploy` (you don't have to push to git to deploy, but it's recommended to keep things in order)


## Front-end location

**Please DO NOT edit `/public` that's where the compiled assets are automatically generated.**

Edit the `/client` folder. `app.vue` is a good starting point.
