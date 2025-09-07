import React, { useRef, useEffect } from 'react'
import { useFormik } from 'formik'
import { Modal, FormGroup, FormControl, FormLabel, Button, Form } from 'react-bootstrap'
// import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
// import leoProfanity from 'leo-profanity'
// import { toast } from 'react-toastify'

import { useChat } from '../../hooks/index.js'
import { selectChannelsEntities } from '../../slices/channelsState.js'

// const validationChannelsSchema = (channels, text) => yup.object().shape({
//   name: yup
//     .string()
//     .trim()
//     .required(text('required'))
//     .min(3, text('min'))
//     .max(20, text('max'))
//     .notOneOf(channels, text('duplicate')),
// })

const validationChannelsSchema = channels => yup.object().shape({ //        УДАЛИТЬ
  name: yup
    .string()
    .trim()
    .required('Required')
    .min(3, 'Must be at least 3 characters')
    .max(20, 'Must be no more than 20 characters')
    .notOneOf(channels, 'Must be unique'),
})

const ModalRenameChanel = ({ closeHandler, changed }) => {
  // const { t } = useTranslation()
  const refContainer = useRef('')
  useEffect(() => {
    setTimeout(() => {
      refContainer.current.select()
    }, 1)
  }, [])
  const chatApi = useChat()

  const allChannels = useSelector(selectChannelsEntities)
  const channelsName = Object.values(allChannels).map(channel => channel.name)
  const channel = Object.values(allChannels).find(({ id }) => id === changed)

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    // validationSchema: validationChannelsSchema(channelsName, t),
    validationSchema: validationChannelsSchema(channelsName), //        УДАЛИТЬ
    onSubmit: async (values) => {
      const { name } = values
      console.log(name)
      console.log(changed)
      // const cleanedName = leoProfanity.clean(name)
      await chatApi.renameChannel({ name: { name }, id: changed }) //                   УБРАТЬ СКОБКИ {}
        .then(() => {
          closeHandler()
          // toast.info(t('toast.renamedChannel'))
        })
        .catch((error) => {
          console.error(error)
          // toast.error(t('toast.dataLoadingError'))
        })
    },
  })
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>modals.renameChannel</Modal.Title>
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
            <FormLabel htmlFor="name" className="visually-hidden">modals.nameChannel</FormLabel>
            <FormControl.Feedback type="invalid">
              {formik.errors.name}
            </FormControl.Feedback>
            <Modal.Footer>
              <Button variant="secondary" type="button" onClick={closeHandler}>modals.cancelButton</Button>
              <Button variant="primary" type="submit" onClick={formik.handleSubmit}>modals.rename</Button>
            </Modal.Footer>
          </FormGroup>
        </Form>
      </Modal.Body>
    </>
  )
}

export default ModalRenameChanel
