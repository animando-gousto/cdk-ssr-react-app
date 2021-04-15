import { Form, Field } from 'react-final-form'
import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAppDispatch } from '../../store/hooks';
import { addUser } from '../../store/sagas/http/httpSaga';

interface UserFormViewProps {
  onSubmit: (form: any) => void,
}
export const UserFormView = ({ onSubmit }: UserFormViewProps) => (
  <div>
    <h4>New User</h4>
    <Form onSubmit={onSubmit} render={
    ({ handleSubmit, submitting }) =>
      <form onSubmit={handleSubmit}>
        <p>{submitting}</p>
        <Container>
          <Row>
            <Col md={6}>
              <Field name="username" placeholder="Username" component="input" type="text" />
            </Col>
            <Col md={6}>
              <Field name="password" placeholder="Password" component="input" type="password" />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Field name="firstName" placeholder="First name" component="input" type="text" />
            </Col>
            <Col md={6}>
              <Field name="surname" placeholder="Surname" component="input" type="text" />
            </Col>
          </Row>
        </Container>
        <button type="submit">Submit</button>
      </form>
    }
  />
  </div>
)

const UserForm = () => {
  const dispatch = useAppDispatch()

  const onSubmit = React.useCallback((form: any) => {
    dispatch(addUser({body: form}))
  }, [dispatch])

  return (
    <UserFormView onSubmit={onSubmit} />
  )
}

export default UserForm
