import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const submitMeeting = async ({ title, transcript }) => {
  const { data } = await api.post('/meetings/text', { title, transcript })
  return data
}

export const transcribeMeetingAudio = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post('/meetings/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}

export const getAllMeetings = async () => {
  const { data } = await api.get('/meetings')
  return data
}

export const getMeetingById = async (id) => {
  const { data } = await api.get(`/meetings/${id}`)
  return data
}
export const deleteMeeting = async (id) => {
  await api.delete(`/meetings/${id}`)
}
