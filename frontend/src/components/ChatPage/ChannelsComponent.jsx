import { useEffect, useRef } from 'react'
import { Button, Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { actions } from '../../slices/index.js'
import { selectChannelsEntities } from '../../slices/channelsState.js'
import Channel from './Channel.jsx'
import ModalChat from './ModalChat.jsx'

const ChannelsComponent = () => {
  const allChannels = useSelector(selectChannelsEntities)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { openModal } = actions
  const openAddChannelWindow = () => {
    dispatch(openModal({ type: 'addChannel' }))
  }

  const channelsView = useRef(null)
  useEffect(() => {
    channelsView.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }, [allChannels.length])

  return (
    <>
      <ModalChat />
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>{t('channels')}</b>
          <Button
            variant="group-vertical"
            className="p-0 text-primary"
            onClick={openAddChannelWindow}
          >
            <span className="visually-show">+</span>
          </Button>
        </div>
        <Nav
          defaultActiveKey={t('general')}
          className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          as="ul"
          ref={channelsView}
        >
          {Object.entries(allChannels).map(([id, channel]) => (
            <Channel channel={channel} key={id} />
          ))}
        </Nav>
      </div>
    </>
  )
}

export default ChannelsComponent
