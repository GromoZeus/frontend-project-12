import { useEffect, useRef, useMemo, useCallback } from 'react'
import { useFormik } from 'formik'
import leoProfanity from 'leo-profanity'
import { Modal, FormGroup, FormControl, FormLabel, Button, Form } from 'react-bootstrap'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useChat } from '../../hooks/index.js'
import { actions } from '../../slices/index.js'
import { selectChannelsEntities } from '../../slices/channelsState.js'

const ModalAddChannel = ({ closeHandler }) => {
  const { t } = useTranslation()
  const allChannels = useSelector(selectChannelsEntities)
  const chatApi = useChat()
  const refContainer = useRef('')
  const { setActualChannel } = actions
  const dispatch = useDispatch()

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

  useEffect(() => {
    refContainer.current?.focus()
  }, [])

  const handleSubmit = useCallback(async (values) => {
    try {
      const cleanedName = leoProfanity.clean(values.name.trim())
      const { id } = await chatApi.newChannel({ name: cleanedName })

      dispatch(setActualChannel(id))
      closeHandler()
      toast.success(t('toast.createChannel'))
    }
    catch {
      toast.error(t('toast.dataLoadingError'))
    }
  }, [chatApi, dispatch, setActualChannel, closeHandler, t])

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <>
      <Modal.Header closeButton={closeHandler}>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              className="mb-2"
              ref={refContainer}
              id="name"
              name="name"
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
              <Button variant="primary" type="submit" onClick={formik.handleSubmit}>{t('modals.addButton')}</Button>
            </Modal.Footer>
          </FormGroup>
        </Form>
      </Modal.Body>
    </>
  )
}

export default ModalAddChannel
