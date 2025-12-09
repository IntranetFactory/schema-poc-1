import { createFileRoute } from '@tanstack/react-router'
import { Playground } from '../components/Playground'

export const Route = createFileRoute('/schema-playground')({
  component: Playground,
})
