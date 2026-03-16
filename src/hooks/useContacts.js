import { contacts } from '../data/contacts'

export function useContacts() {
  return { contacts, loading: false, error: null }
}