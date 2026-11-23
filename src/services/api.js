const API_URL = 'http://localhost:5000'

export const getMembers = async () => {
  const response = await fetch(`${API_URL}/members`)
  if (!response.ok) throw new Error('Failed to fetch members')
  return response.json()
}

export const getGroups = async () => {
  const response = await fetch(`${API_URL}/groups`)
  if (!response.ok) throw new Error('Failed to fetch groups')
  return response.json()
}

export const getContributions = async () => {
  const response = await fetch(`${API_URL}/contributions`)
  if (!response.ok) throw new Error('Failed to fetch contributions')
  return response.json()
}

export const getPayments = async () => {
  const response = await fetch(`${API_URL}/payments`)
  if (!response.ok) throw new Error('Failed to fetch payments')
  return response.json()
}