import { redirect } from 'next/navigation'

/**
 * Programs Page Component
 *
 * This component serves as a redirect route from /programs to /credentials.
 * This is used to maintain backward compatibility or provide a more
 * intuitive URL structure for users while consolidating content under
 * the /credentials route.
 *
 * Note: This is a Server Component that performs a server-side redirect,
 * meaning the redirect happens before any HTML is sent to the client.
 *
 * @returns Never actually returns - redirect() throws a redirect response
 */
export default function ProgramsPage(): never {
  // Perform an immediate server-side redirect to the credentials page
  // This ensures that anyone navigating to /programs will be automatically
  // redirected to /credentials without any client-side JavaScript
  redirect('/credentials')
}
