import React from 'react'
import {
  Form,
  Container,
  Header,
  Button,
  Grid,
  Message
} from 'semantic-ui-react'
import { useField, Formik, FieldArray, useFormikContext } from 'formik'
import * as Yup from 'yup'

const MyTextInput = ({ ...props }: any) => {
  const [field, meta] = useField(props.name)
  const error = meta.touched && meta.error ? meta.error : false
  return <Form.Input{...field}{...props} error={error}/>
}

const MyCheckbox = ({ ...props }: any) => {
  const { setFieldValue } = useFormikContext()
  return <Form.Checkbox{...props} onChange={(e, data) => setFieldValue(props.name, data.checked)}/>
}

const MySelect = ({ ...props }: any) => {
  const [, meta] = useField(props.name)
  const { setFieldValue } = useFormikContext()
  const error = meta.touched && meta.error ? meta.error : false
  return <Form.Select{...props} error={error} onChange={(e, data) => setFieldValue(props.name, data.value)}/>
}

const initPassenger = {
  fss: false,
  snilsOrCsm: '',
  surname: '',
  name: '',
  patronymic: '',
  gender: '',
  birthday: '',
  country: '',
  documentType: '',
  documentNumber: '',
  tariff: '',
  notification: false,
  phone: '',
  email: ''
}

function App () {
  return (
    <Container style={{ marginTop: '15px' }}>
      <Header as="h1" content="Заказ билета"/>
      <hr/>
      <Formik
        initialValues={{ passengers: [initPassenger] }}
        validationSchema={Yup.object().shape({
          passengers: Yup.array().of(
            Yup.object().shape({
              surname: Yup.string().required('Введите фамилию'),
              name: Yup.string().required('Введите имя'),
              patronymic: Yup.string().required('Введите отчество'),
              birthday: Yup.string().required('Введите дату рождения'),
              documentNumber: Yup.string().required('Введите номер документа'),
              gender: Yup.string().required('Выберете пол'),
              country: Yup.string().required('Выберете гражданство'),
              documentType: Yup.string().required('Выберете тип документа'),
              tariff: Yup.string().required('Выберете тариф')
            })
          ).required('Должен быть хотя бы один пассажир')
        })}
        onSubmit={(values) => {
          console.log(values)
          const proxy = 'https://cors-anywhere.herokuapp.com/'
          fetch(proxy + 'https://webhook.site/0c1aec1a-fde7-40f5-8069-745f00ee6eb7', {
            method: 'post',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
          })
        }}
      >
        {
          ({ values, handleSubmit, errors }) => (
            <Form onSubmit={handleSubmit}>
              <FieldArray
                name="passengers"
              >
                {
                  arrayHelpers => (
                    <div>
                      {
                        values.passengers.map((passenger, index) => (
                          <div style={{ marginBottom: '15px' }} key={index}>
                            <Grid columns={2}>
                              <Grid.Column>
                                <Header as="h2" content={`Пассажир №${index + 1}`}/>
                              </Grid.Column>
                              <Grid.Column textAlign="right">
                                <Button onClick={() => arrayHelpers.remove(index)} type="button">
                                  Удалить пассажира
                                </Button>
                              </Grid.Column>
                            </Grid>
                            <MyCheckbox name={`passengers.${index}.fss`} label="Оформление билета по ФСС"/>
                            <Grid>
                              <Grid.Row columns={3}>
                                <Grid.Column>
                                  <MyTextInput
                                    name={`passengers.${index}.snilsOrCsm`}
                                    label="СНИЛС или номер регистрации ЦСМ"
                                  />
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                            <Form.Group widths='equal'>
                              <MyTextInput name={`passengers.${index}.surname`} label="Фамилия"/>
                              <MyTextInput name={`passengers.${index}.name`} label="Имя"/>
                              <MyTextInput name={`passengers.${index}.patronymic`} label="Отчество (при наличии)"/>
                            </Form.Group>

                            <Form.Group widths='equal'>
                              <MySelect
                                options={[
                                  { key: 'm', text: 'Мужской', value: 'Мужской' },
                                  { key: 'f', text: 'Женский', value: 'Женский' },
                                  { key: 'o', text: 'Другой', value: 'Другой' }
                                ]}
                                name={`passengers.${index}.gender`}
                                label="Пол"
                                placeholder="Ваш пол"
                              />
                              <MyTextInput name={`passengers.${index}.birthday`} label="Дата рождения"/>
                              <MySelect
                                options={[{ key: 'russia', text: 'Россия', value: 'Россия' }]}
                                name={`passengers.${index}.country`}
                                label="Гражданство"
                                placeholder="Ваше гражданство"
                              />
                            </Form.Group>

                            <Form.Group widths='equal'>
                              <MySelect
                                options={[{ key: 'passport', text: 'Паспорт РФ', value: 'Паспорт РФ' }]}
                                name={`passengers.${index}.documentType`}
                                label="Тип документа"
                                placeholder="Тип документа"
                              />
                              <MyTextInput name={`passengers.${index}.documentNumber`} label="Номер документа"/>
                              <MySelect
                                options={[{ key: 'econom', text: 'Эконом', value: 'Эконом' }]}
                                name={`passengers.${index}.tariff`}
                                label="Тариф"
                                placeholder="Ваш тариф"
                              />
                            </Form.Group>

                            <MyCheckbox
                              name={`passengers.${index}.notification`}
                              label="Согласен на получение оповещений в случаях ЧС (введите контакты)"
                            />

                            <Grid>
                              <Grid.Row columns={3}>
                                <Grid.Column>
                                  <MyTextInput name={`passengers.${index}.phone`} label="Телефон пассажира"/>
                                </Grid.Column>
                                <Grid.Column>
                                  <MyTextInput name={`passengers.${index}.email`} label="E-mail пассажира"/>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>

                          </div>
                        ))
                      }
                      <Button onClick={() => arrayHelpers.insert(values.passengers.length, initPassenger)}
                              type="button">
                        Добавить пассажира
                      </Button>
                      <Button type="submit" disabled={typeof errors.passengers === 'string'}>
                        Заказать билет
                      </Button>

                      {
                        typeof errors.passengers === 'string' &&
                        <Message>
                          <Message.Header>Ошибка</Message.Header>
                          <p>
                            Должен быть хотя бы один пассажир
                          </p>
                        </Message>
                      }
                    </div>
                  )
                }
              </FieldArray>
            </Form>
          )
        }
      </Formik>
    </Container>
  )
}

export default App
