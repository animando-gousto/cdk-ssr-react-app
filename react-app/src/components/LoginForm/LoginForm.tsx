import * as React from 'react';
import { Form, Field } from 'react-final-form'
import { useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { useAppDispatch } from '../../store/hooks'
import { LoginFormData } from '../../store/session/state'
import urlParse from 'url-parse'
import { requestToken } from '../../store/sagas/http/httpSaga'

const AsyncSubmitButton = styled.button.attrs((props: any) => {
  return ({
    className: 'btn',
    type: 'submit',
    children: props.title || 'Submit',
  })
})
``

const useLogin = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const history = useHistory();
  const redirect = urlParse(`${location.pathname}${location.search}`, true).query.redirect

  const doRedirect = React.useCallback(() => {
    console.log('do redirect')
    redirect && history.push(redirect);
  }, [redirect, history])

  const onSubmit = React.useCallback((formValues: LoginFormData) => {
    dispatch(requestToken({ body: formValues, context: { doRedirect } }))
  }, [dispatch, doRedirect])

  return onSubmit
}

const LoginForm = () => {
  const onSubmit = useLogin();

  return <Form onSubmit={onSubmit} render={
    ({ handleSubmit, submitting }) =>
      <form onSubmit={handleSubmit}>
        <Field name="username" placeholder="Username" component="input" type="text" />
        <Field name="password" placeholder="Password" component="input" type="password" />
        <AsyncSubmitButton title="Login" disabled={submitting} />
      </form>
    }
  />
}
export default LoginForm
