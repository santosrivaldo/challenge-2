import { Button } from '../components/Button'
import { Card } from '../components/Card'

export function NotFoundPage() {
  return (
    <Card title="Page not found" description="The URL may be wrong or the page was removed.">
      <Button to="/">Go to users</Button>
    </Card>
  )
}
