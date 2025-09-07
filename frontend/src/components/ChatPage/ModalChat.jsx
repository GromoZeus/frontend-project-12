import React from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import modalWindow from './ModalWindow.js'
import { actions } from '../../slices/index.js'
import { selectIsOpenedModal, selectTypeModal, selectChangedModal } from '../../slices/UIState.js'
import { selectChannelsEntities } from '../../slices/channelsState.js'

const { closeModal } = actions

const ModalChat = () => {
  const isOpened = useSelector(selectIsOpenedModal)
  const type = useSelector(selectTypeModal)
  const extra = useSelector(selectChangedModal)
  const allChannels = useSelector(selectChannelsEntities)
  const dispatch = useDispatch()

  const closeHandler = () => {
    dispatch(closeModal())
  }

  const ActyalModal = modalWindow(type)

  return (
    <Modal show={isOpened} onHide={closeHandler} centered>
      {ActyalModal && (
        <ActyalModal
          closeHandler={closeHandler}
          changed={extra}
          allChannels={allChannels}
        />
      )}
    </Modal>
  )
}

export default ModalChat
