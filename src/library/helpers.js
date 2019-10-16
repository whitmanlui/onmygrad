import React from 'react'
import { Alert } from 'react-native'
import { select, put } from 'redux-saga/effects'
import _ from 'lodash'

const api = 'https://api.onmygrad.com/app'
const token = "4sQO2d1V7qnWjtBXtm8igRNwxeW334"

//common function
let alerted = false
const handleError = (err: any, language: string, request: Request)=> {
    //do error action here
    if(__DEV__)
        console.log("Error request", request, err)

    if(!alerted){
        Alert.alert("", "Network Error",[{text: "Ok", onPress: () => {alerted = false;}}], { cancelable: false})
        alerted = true
    }
}

export const fetchWithGet = function*(path: string): any {
    const req = new Request(`${api}/${path}`, { method: 'GET' })
    req.headers.append('Content-Type', `application/x-www-form-urlencoded`)

    const language = yield select(state => state.app.lang)
    if(__DEV__)
      console.log("Get fetch:",req )
      
    try{
      const r0 = fetch(req)
      return r0.json()
    }catch(err){
      handleError(err, language, req)
    }
}

export const fetchWithPost = function*(path: string, data: any): any {
  const language = yield select(state => state.app.lang)
  const token = yield select(state => state.auth.token)
  data = _.assign({}, data, token)
  console.log(data)
  let formBody = [];
  for (const k in data) {
    formBody.push(encodeURIComponent(k) + "=" + encodeURIComponent(data[k]));
  }
  //formBody.push("id=419")
  //formBody.push("token=Gn16w8aKsKef6SUUnUfG")
  formBody = formBody.join("&");

  const req = new Request(`${api}/${path}`, {
    method: 'POST',
    body: formBody
  })
  req.headers.append('Content-Type', `application/x-www-form-urlencoded`)

  if(__DEV__)
    console.log("Post fetch:",req )
    
  try{
    const r0 = yield fetch(req)
    return yield r0.json()
  }catch(err){
    handleError(err, language, req)
  }
}