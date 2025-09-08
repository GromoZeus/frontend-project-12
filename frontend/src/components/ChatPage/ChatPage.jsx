import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import fetchData from '../../thunk/fetchData.js'
import { useAuth } from '../../hooks/index.js'
import { selectChannelsLoading } from '../../slices/channelsState.js'
import ChannelComponent from './ChannelsComponent.jsx'
import MessagesComponent from './MessagesComponent.jsx'

const ChatPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const auth = useAuth()

  const isLoading = useSelector(selectChannelsLoading)

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch(fetchData(auth.getToken()))
        .unwrap()
        .catch(() => {
          toast.error(t('toast.аuthorisationError'))
        })
    }
    fetchUserData()
  }, [dispatch, auth, t])

  if (isLoading) {
    return (
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <h1>{t('loading')}</h1>
        </div>
      </Container>
    )
  }
  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <ChannelComponent />
        <MessagesComponent />
      </div>
    </Container>
  )
}

export default ChatPage
