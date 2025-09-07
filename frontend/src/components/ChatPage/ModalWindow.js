import ModalAddChannel from './ModalAddChannel.jsx'
import ModalRemoveChannel from './ModalRemoveChannel.jsx'
import ModalRenameChannel from './ModalRenameChannel.jsx'

const modals = {
  addChannel: ModalAddChannel,
  removing: ModalRemoveChannel,
  renaming: ModalRenameChannel,
}

const modalWindow = modalName => modals[modalName]

export default modalWindow
