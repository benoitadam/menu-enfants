import { h, render } from "preact";
import App from "./app";
import WebFont from 'webfontloader'
import './style.css'

WebFont.load({
  google: {
    families: ['Share Tech Mono']
  }
})

render(<App />, document.body);