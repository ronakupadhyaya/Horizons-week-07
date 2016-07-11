# Pair programming exercise: Ho! Ho! Ho!

## Goal

Your goal is to create a simplified clone of the [Yo
app](https://www.justyo.co/), a "contextual messenger" that lets you send a
simple "Yo" message to friends (if you haven't heard of Yo already, [read about
it
here](http://www.businessinsider.com/whats-happened-to-7-million-app-yo-now-that-the-hype-has-died-2014-9)).
You'll build this app using React Native and run it on the mobile platform of
your choice, iOS or Android.

Your app will have the following features:

- Login/register
- Find friends who are already users (search by name, phone number, or email)
  and invite friends via email or SMS
- Invitees can accept invitations and the relationship is then established; they
  are invited to download the app, but can also "Ho! Ho! Ho!" the sender
  directly via the web from the link they received
- Tap on a friend's name in the app to "Ho! Ho! Ho!" them

## Instructions

If you haven't already, start by following the instructions in [today's warmup
exercise](../warmup.md) to install the required components for React Native.

This is going to be the first project where your frontend and backend code are
totally separate. Your frontend will be running on a mobile phone (or in a
mobile emulator), via React Native; your backend will be an express app, which
you've seen many times by now. Find the scaffold for the backend app in
`hohoho-backend/` in this folder, and find the scaffold for the frontend app in
`hohoho-frontend/`.

You can start the backend by running `npm start` or `nodemon` in the
`hohoho-backend/` directory.

To start the frontend code in the iOS simulator, `cd` into the
`hohoho-frontend/` directory in the terminal and run `react-native run-ios`.

*FILL IN INFO ON WINDOWS AND ANDROID STUDIO*


## Bonus: push notifications

## Addendum: Running on a real mobile device

