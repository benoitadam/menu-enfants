import { h, Component } from 'preact'
import './style.css'

export default class Modal {
  static success({ title, content, buttons }) {
    console.log(title, content, buttons)
    alert(content)
    return Promise.resolve(null)
  }
}