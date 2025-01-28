import TopEmploymentOutlooks from '@/components/home/TopEmploymentOutlooks'
import CredentialBrowser from '@/components/home/CredentialBrowser'
import JobBrowser from '@/components/home/JobBrowser'
export default function Home() {
  return (
    <>
      {/* Programs & Careers Grid */}
      <div className='grid gap-8 md:grid-cols-2 mb-12'>
        {/* Credentials Section */}
        <section className='p-6 rounded-lg border'>
          <h2 className='text-2xl font-semibold mb-4 text-primary'>
            Browse VIU Credentials
          </h2>
          <p className='text-muted-foreground mb-4'>
            Explore our programs, courses, diplomas, and degrees.
          </p>
          <CredentialBrowser />
        </section>

        {/* Career Paths Section */}
        <section className='p-6 rounded-lg border'>
          <h2 className='text-2xl font-semibold mb-4 text-primary'>
            Explore Career Paths
          </h2>
          <p className='text-muted-foreground mb-4'>
            Find jobs related to VIU programs and their employment outlook.
          </p>
          <JobBrowser />
        </section>
      </div>

      {/* Employment Outlook Section */}
      <section>
        <h2 className='text-2xl font-semibold mb-6 text-primary'>
          Employment Outlook
        </h2>
        <div className='grid gap-8 md:grid-cols-2'>
          {/* Top Opportunities */}
          <div className='p-6 rounded-lg border'>
            <h3 className='text-xl font-semibold mb-4'>Top Opportunities</h3>
            <TopEmploymentOutlooks type='top' />
          </div>

          {/* Areas of Concern */}
          <div className='p-6 rounded-lg border'>
            <h3 className='text-xl font-semibold mb-4'>
              Limited Opportunities
            </h3>
            <TopEmploymentOutlooks type='bottom' />
          </div>
        </div>
      </section>
    </>
  )
}
