import { Form, Field } from 'react-final-form'
import styled from 'styled-components'
import { useAppDispatch } from '../../store/hooks'
import { doLogin, LoginFormData } from '../../store/session/state'

const AsyncSubmitButton = styled.button.attrs((props: any) => {
  return ({
    className: 'btn',
    type: 'submit',
    children: props.title || 'Submit',
  })
})
`
  // background: ${({ disabled }) => disabled ? 'red' : 'green'};
`

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const onSubmit = async (formValues: LoginFormData) => {
    await dispatch(doLogin(formValues) as any)
  }

  return <Form onSubmit={onSubmit} render={({ handleSubmit, submitting }) =>
    <form onSubmit={handleSubmit}>
      <Field name="username" placeholder="Username" component="input" type="text" />
      <Field name="password" component="input" type="password" />
      <AsyncSubmitButton title="Login" disabled={submitting} />
    </form>
  } />
}
export default LoginForm
