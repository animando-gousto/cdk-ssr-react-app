import * as React from 'react'
import { Button, Modal } from 'react-bootstrap'
import withModal, { ModalTriggerProps, ModalProps } from './withModal'

type ContentProps = {
  onClose: () => void
}
type LinkModalProps = {
  label: React.ReactNode,
  header?: React.ReactNode,
  children: (props: ContentProps) => React.ReactNode,
}
const LinkModalButton = ({ label, openModal }: LinkModalProps & ModalTriggerProps) => <Button variant="link" onClick={openModal}>{label}</Button>

const ModalContent = ({open, children, onHide, header}: LinkModalProps & ModalProps) =>
  <Modal show={open} onHide={onHide} animation={false}>
    {header && <Modal.Header>{header}</Modal.Header>}
    <Modal.Body>
      {children({ onClose: () => onHide() })}
    </Modal.Body>
  </Modal>

const LinkModal = withModal<LinkModalProps>(LinkModalButton, ModalContent)

export default LinkModal
