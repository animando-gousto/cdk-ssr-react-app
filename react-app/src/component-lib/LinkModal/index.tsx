import * as React from 'react'
import { Button, Modal } from 'react-bootstrap'

type ChildProps = {
  onClose: () => void,
}
type Props = {
  label: React.ReactNode,
  children: (props: ChildProps) => React.ReactNode
}

const LinkModal = ({ label, children }: Props) => {
  const [showModal, setShowModal] = React.useState(false)
  return <>
    <Button onClick={() => setShowModal(true)}>{label}</Button>
    <Modal show={showModal} backdrop={'static'} onHide={() => setShowModal(false)}>
      <Modal.Header>
        Heading
      </Modal.Header>
      <Modal.Body>
        {children({onClose: () => setShowModal(false)})}
      </Modal.Body>
    </Modal>
  </>
}

export default LinkModal
