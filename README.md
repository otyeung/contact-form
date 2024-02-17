# Contact Form App

## Tech Stack Used

The app is built based on [sveltekit](https://svelte.io/) and Google Form API. Deployment in [Vercel](https://vercel.com/) for GTM demo.

## What does it do

This app is a simple contact form app that collects user contact info and submits the lead to Google Sheet via Google Form API and fire an event to GTM via GA4 client.

It's part of end-to-end demo about the functionality of [LinkedIn CAPI](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/conversions-api?view=li-lms-2024-01&tabs=http) (server side tagging implmentation) with [Google Tag Manager](https://tagmanager.google.com/).

In order to capture & use LinkedIn First Party Cookie (li_fat_id), please make sure :

1. You have installed Insight Tags [directly](https://www.linkedin.com/help/lms/answer/a422760) in your apps, or through [GTM](https://www.linkedin.com/help/lms/answer/a416960/) (preferred method)
2. [Enable first-party cookies](https://www.linkedin.com/help/lms/answer/a423304) on LinkedIn Insight Tag

## Screenshots

![1](/static/cookie_consent.png)
![2](/static/app_screenshot.png)
![3](/static/google_sheet.png)
![4](/static/submit_another_response.png)

## Customize to use your own GTM Tags and Web Container Tag

Please modify the TAG values in "src/app.html".

## Customize to submit the lead to your own Google Form

Please modify the googleFormUrl variable in "/src/routes/index.svelte"

## Test the app locally

Open terminal in your apps directory, run

```
npm i
npm run dev
```

Visit the app at http://localhost:3000?li_fat_id="dummy_li_fat_id"

## Deploy the app to Vercel

1. Sign up a [Vercel account](https://vercel.com/signup)
2. Install [Vercel CLI](https://vercel.com/docs/cli)
3. Open Terminal in your code directory

```
vercel (For first time it shall ask you to login and create a project in your vercel dashboard, you'll see a directory ".vercel" created)
vercel deploy (create a new deployment)
vercel --prod (deploy to production)
```

4. Whenever you made any code changes, execute ["vercel --prod](https://vercel.com/docs/cli/deploy#prod)" again
5. Go to your vercel dashboard, you should copy the Production Domain, this is required in GTM setup.

![5](/static/vercel_production_domain.png)
