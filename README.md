<div align="center"><strong>Start your next react project in seconds</strong></div>

<br />

<div align="center">
  <sub>Created by <a href="https://twitter.com/over_solve">Mike Over</a>.
</div>

## What is this?
<div>
We love <a href="https://github.com/react-boilerplate/react-boilerplate">react-boilerplate</a> but any notion of
authentication is missing entirely and it's not obvious how to make it work with a backend API. So we joined
react-boilerplate with <a href="https://github.com/lynndylanhurley/redux-auth">redux-auth</a> to add the missing authentication functionality using Bootstrap for UI forms. 
</div>
<br/>

<div>Specifically, this package is intended to work seamlessly with <a href="https://github.com/lynndylanhurley/devise_token_auth">devise-token-auth</a>.</div>
<br/>

<div>For more information on either react-boilerplate or redux-auth, I recommend checking out their extensive README's and related documentation.</div>

## Quick start

1. Clone this repo using `git clone --depth=1 https://github.com/mikeover/react-boilerplate-redux-auth.git`
2. Move to the appropriate directory: `cd react-boilerplate-redux-auth`.<br />
3. Run `npm run setup` in order to install dependencies and clean the git repo.<br />
   *We auto-detect `yarn` for installing packages by default, if you wish to force `npm` usage do: `USE_YARN=false npm run setup`*<br />
4. In app.js, replace "http://TODO-YOUR-API-ENDPOINT" with the URL of your API endpoint.
5. At this point you can run `[PORT=3000] npm start` to see the example app at `http://localhost:3000`.

## License

This project is licensed under the MIT license, Copyright (c) 2018 Michael Over. For more information see `LICENSE.md`.
