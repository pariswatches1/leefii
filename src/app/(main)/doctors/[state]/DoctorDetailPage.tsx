import Link from 'next/link'

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAY_NAMES: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

function isOpenNow(hours: any[]): { open: boolean; nextChange: string } {
  if (!hours || hours.length === 0) return { open: false, nextChange: '' }
  const now = new Date()
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const today = days[now.getDay()]
  const currentTime = now.getHours() * 100 + now.getMinutes()
  const todayHours = hours.find((h) => h.dayOfWeek === today)
  if (!todayHours || todayHours.isClosed) return { open: false, nextChange: 'Closed today' }
  const openTime = parseInt(todayHours.openTime.replace(':', ''))
  const closeTime = parseInt(todayHours.closeTime.replace(':', ''))
  if (currentTime < openTime) return { open: false, nextChange: `Opens at ${formatTime(todayHours.openTime)}` }
  if (currentTime >= openTime && currentTime <= closeTime) return { open: true, nextChange: `Closes at ${formatTime(todayHours.closeTime)}` }
  return { open: false, nextChange: 'Closed' }
}

interface DoctorDetailProps {
  doctor: any
  relatedDoctors: any[]
}

export default function DoctorDetailPage({ doctor, relatedDoctors }: DoctorDetailProps) {
  const sortedHours = [...(doctor.businessHours || [])].sort(
    (a: any, b: any) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  )
  const { open, nextChange } = isOpenNow(doctor.businessHours || [])

  const locationString = [doctor.city, doctor.state].filter(Boolean).join(', ')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    ...(doctor.businessName ? { alternateName: doctor.businessName } : {}),
    description: doctor.description,
    url: `https://leefii.com/doctors/${doctor.slug}`,
    telephone: doctor.phone,
    ...(doctor.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: doctor.address,
            addressLocality: doctor.city,
            addressRegion: doctor.state,
            postalCode: doctor.zipCode,
            addressCountry: 'US',
          },
        }
      : {}),
    ...(doctor.latitude && doctor.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: doctor.latitude,
            longitude: doctor.longitude,
          },
        }
      : {}),
    ...(sortedHours.length > 0
      ? {
          openingHoursSpecification: sortedHours.map((h: any) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dayOfWeek.charAt(0) + h.dayOfWeek.slice(1).toLowerCase(),
            opens: h.openTime,
            closes: h.closeTime,
          })),
        }
      : {}),
    ...(doctor.rating && doctor.reviewsCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: doctor.rating,
            reviewCount: doctor.reviewsCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Doctors', item: 'https://leefii.com/doctors' },
      ...(doctor.state
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: doctor.state,
              item: `https://leefii.com/doctors/${doctor.state.toLowerCase()}`,
            },
          ]
        : []),
      { '@type': 'ListItem', position: doctor.state ? 4 : 3, name: doctor.name },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/doctors" className="text-gray-500 hover:text-gray-700">Doctors</Link>
              {doctor.state && (
                <>
                  <span className="text-gray-400">/</span>
                  <Link href={`/doctors/${doctor.state.toLowerCase()}`} className="text-gray-500 hover:text-gray-700">
                    {doctor.state}
                  </Link>
                </>
              )}
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{doctor.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                    {doctor.businessName && <p className="text-gray-600">{doctor.businessName}</p>}
                  </div>
                  {doctor.rating != null && doctor.rating > 0 && (
                    <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-yellow-500 text-xl mr-1">★</span>
                      <span className="text-xl font-bold text-gray-900">{doctor.rating.toFixed(1)}</span>
                      {doctor.reviewsCount != null && doctor.reviewsCount > 0 && (
                        <span className="text-sm text-gray-500 ml-2">({doctor.reviewsCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Badges */}
                <div className="mt-4 flex items-center space-x-3 flex-wrap gap-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {open ? 'Open Now' : 'Closed'}
                  </span>
                  {nextChange && <span className="text-gray-600 text-sm">{nextChange}</span>}
                  {doctor.telemedicine && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      Telehealth Available
                    </span>
                  )}
                  {doctor.isVerified && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {doctor.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 leading-relaxed">{doctor.description}</p>
                </div>
              )}

              {/* Services */}
              {doctor.services && doctor.services.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {doctor.services.map((s: string) => (
                      <span key={s} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialties */}
              {doctor.specialties && doctor.specialties.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((s: string) => (
                      <span key={s} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hours */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours of Operation</h2>
                <div className="bg-gray-50 rounded-xl p-5">
                  {sortedHours.length > 0 ? (
                    <div className="space-y-2">
                      {sortedHours.map((h: any) => {
                        const isToday = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase() === h.dayOfWeek
                        return (
                          <div
                            key={h.dayOfWeek}
                            className={`flex justify-between py-2 ${isToday ? 'font-semibold text-green-600' : 'text-gray-600'}`}
                          >
                            <span>{DAY_NAMES[h.dayOfWeek]}{isToday && ' (Today)'}</span>
                            <span>{h.isClosed ? 'Closed' : `${formatTime(h.openTime)} - ${formatTime(h.closeTime)}`}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">Hours not available. Please call for hours.</p>
                  )}
                </div>
              </div>

              {/* Map */}
              {doctor.latitude && doctor.longitude && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                    <a
                      href={`https://maps.google.com/?q=${doctor.latitude},${doctor.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              )}

              {/* Reviews placeholder - can be extended later */}
              {doctor.rating != null && doctor.rating > 0 && doctor.reviewsCount != null && doctor.reviewsCount > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Reviews</h2>
                  <div className="bg-gray-50 rounded-xl p-5 text-center">
                    <span className="text-yellow-500 text-3xl">★</span>
                    <span className="text-2xl font-bold text-gray-900 ml-2">{doctor.rating.toFixed(1)}</span>
                    <p className="text-gray-500 mt-1">Based on {doctor.reviewsCount} reviews</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="space-y-4 mb-6">
                  {doctor.address && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Address</div>
                      <div className="font-medium text-gray-900">
                        {doctor.address}
                        <br />
                        {locationString} {doctor.zipCode}
                      </div>
                    </div>
                  )}
                  {doctor.phone && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Phone</div>
                      <a href={`tel:${doctor.phone.replace(/[^0-9]/g, '')}`} className="font-medium text-green-600 hover:text-green-700">
                        {doctor.phone}
                      </a>
                    </div>
                  )}
                  {doctor.website && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Website</div>
                      <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="font-medium text-green-600 hover:text-green-700">
                        Visit Website →
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {doctor.phone && (
                    <a
                      href={`tel:${doctor.phone.replace(/[^0-9]/g, '')}`}
                      className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                  )}
                  {doctor.latitude && doctor.longitude && (
                    <a
                      href={`https://maps.google.com/?q=${doctor.latitude},${doctor.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                  )}
                  {doctor.website && (
                    <a
                      href={doctor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-3">Features</div>
                  <div className="space-y-2">
                    {doctor.telemedicine && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Telehealth Available
                      </div>
                    )}
                    {doctor.walkInsWelcome && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Walk-ins Welcome
                      </div>
                    )}
                    {doctor.acceptsInsurance && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Accepts Insurance
                      </div>
                    )}
                    {doctor.languages && doctor.languages.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Languages: {doctor.languages.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Doctors */}
          {relatedDoctors.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Other Doctors in {doctor.state || 'Your Area'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedDoctors.map((related: any) => (
                  <Link
                    key={related.id}
                    href={`/doctors/${related.slug}`}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all"
                  >
                    <div className="font-semibold text-gray-900 hover:text-green-600 mb-1">{related.name}</div>
                    {related.city && <div className="text-sm text-gray-500">{related.city}, {related.state}</div>}
                    {related.rating != null && related.rating > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-700">{related.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
