import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import { useFormik } from 'formik'
import { Modal, FormGroup, FormControl, FormLabel, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import leoProfanity from 'leo-profanity'
import { toast } from 'react-toastify'

import { useChat } from '../../hooks/index.js'
import { selectChannelsEntities } from '../../slices/channelsState.js'

const ModalRenameChanel = ({ closeHandler, changed }) => {
  const { t } = useTranslation()
  const refContainer = useRef('')
  const chatApi = useChat()
  const allChannels = useSelector(selectChannelsEntities)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (refContainer.current) {
        refContainer.current.select()
      }
    }, 1)

    return () => clearTimeout(timer)
  }, [])

  const channel = useMemo(() =>
    Object.values(allChannels).find(({ id }) => id === changed),
  [allChannels, changed],
  )

  const channelsName = useMemo(() =>
    Object.values(allChannels).map(channel => channel.name),
  [allChannels],
  )

  const validationSchema = useMemo(() =>
    yup.object().shape({
      name: yup
        .string()
        .trim()
        .required(t('required'))
        .min(3, t('min'))
        .max(20, t('max'))
        .notOneOf(channelsName, t('duplicate')),
    }),
  [t, channelsName],
  )

  const handleSubmit = useCallback(async (values) => {
    const { name } = values
    const cleanedName = leoProfanity.clean(name)

    try {
      await chatApi.renameChannel({
        name: { name: cleanedName },
        id: changed,
      })
      closeHandler()
      toast.info(t('toast.renamedChannel'))
    }
    catch {
      toast.error(t('toast.dataLoadingError'))
    }
  }, [chatApi, changed, closeHandler, t])

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema,
    onSubmit: handleSubmit,
  })
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              className="mb-2"
              ref={refContainer}
              name="name"
              id="name"
              required=""
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={!!formik.errors.name}
            />
            <FormLabel htmlFor="name" className="visually-hidden">{t('modals.nameChannel')}</FormLabel>
            <FormControl.Feedback type="invalid">
              {formik.errors.name}
            </FormControl.Feedback>
            <Modal.Footer>
              <Button variant="secondary" type="button" onClick={closeHandler}>{t('modals.cancelButton')}</Button>
              <Button variant="primary" type="submit" onClick={formik.handleSubmit}>{t('modals.rename')}</Button>
            </Modal.Footer>
          </FormGroup>
        </Form>
      </Modal.Body>
    </>
  )
}

export default ModalRenameChanel
