import { Form, Field } from 'react-final-form'
import { useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { useAppDispatch } from '../../store/hooks'
import { doLogin, LoginFormData } from '../../store/session/state'
import urlParse from 'url-parse'

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

  const onSubmit = async (formValues: LoginFormData) => {
    await dispatch(doLogin(formValues) as any)
    redirect && history.push(redirect);
  }

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
