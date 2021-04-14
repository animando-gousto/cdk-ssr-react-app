import * as React from 'react'

export interface ModalProps {
  open: boolean,
  onHide: () => void,
}

export interface ModalTriggerProps {
  openModal: () => void,
}

function withModal<T>(TriggerComponent: React.ComponentType<ModalTriggerProps & T>, Modal:React.ComponentType<ModalProps & T>) {
  return (props: T) => {
    const [showModal, setShowModal] = React.useState(false)
    const openModal = React.useCallback(() => {
      setShowModal(true)
    }, [])
    const hideModal = React.useCallback(() => {
      setShowModal(false)
    }, [])
    return <>
      <TriggerComponent openModal={openModal} {...props} />
      <Modal open={showModal} onHide={hideModal} {...props} />
    </>
  }
}

export default withModal
