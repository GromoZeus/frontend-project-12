import React from 'react'
import { Modal, Button } from 'react-bootstrap'
// import { useTranslation } from 'react-i18next'
// import { toast } from 'react-toastify'

import { useChat } from '../../hooks/index.js'

const ModalRemoveChannel = ({ closeHandler, changed }) => {
  // const { t } = useTranslation()
  const chatApi = useChat()
  const deleteChannel = async (e) => {
    e.preventDefault()
    await chatApi.removeChannel(changed)
      .then(() => {
        closeHandler()
        // toast.warn(t('toast.removeChannel'))
      })
      .catch((error) => {
        console.error(error)
        // toast.error(t('toast.dataLoadingError'))
      })
  }
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>modals.removeChannel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">modals.questionInModal</p>
        <Modal.Footer>
          <Button variant="secondary" className="me-2" type="button" onClick={closeHandler}>modals.cancelButton</Button>
          <Button variant="danger" type="button" onClick={deleteChannel}>modals.removeButton</Button>
        </Modal.Footer>
      </Modal.Body>
    </>
  )
}

export default ModalRemoveChannel
