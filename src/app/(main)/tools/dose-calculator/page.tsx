import { Metadata } from 'next'
import Link from 'next/link'
import DoseCalculator from './DoseCalculator'

const title = 'Edible Dosage Calculator — How Many mg Should I Take? (2026) | Leefii'
const description = 'Free edible dosage calculator. Find the right THC dose based on your experience level, body weight, and desired intensity. Covers gummies, chocolates, tinctures & more.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/tools/dose-calculator', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/tools/dose-calculator' },
}

const faqs = [
  {
    question: 'How many mg of edibles should a beginner take?',
    answer: 'Most experts recommend beginners start with 2.5 to 5 mg of THC. This allows you to gauge your sensitivity before increasing the dose. Wait at least 2 hours after your first dose before considering taking more, as edibles can take a long time to reach peak effects.',
  },
  {
    question: 'How long does it take for edibles to kick in?',
    answer: 'Most edibles take 30 to 90 minutes to produce noticeable effects, though some products like tinctures and nano-emulsion beverages can act faster (15 to 30 minutes). Baked goods and capsules may take up to 2 hours. Factors like metabolism, stomach contents, and the specific product all influence onset time.',
  },
  {
    question: 'How long do edible effects last?',
    answer: 'Edible effects typically last 4 to 8 hours, with peak effects occurring 2 to 3 hours after consumption. Higher doses and slower-absorbing products like baked goods can produce effects lasting up to 12 hours. Plan accordingly and avoid driving or operating machinery during this time.',
  },
  {
    question: 'What happens if I take too much THC?',
    answer: 'Taking too much THC can cause anxiety, paranoia, rapid heart rate, nausea, and extreme drowsiness. While a THC overdose is not life-threatening, it can be very uncomfortable. If this happens, stay calm, drink water, find a comfortable place to rest, and consider using CBD, which may help counteract some of the effects. The experience will pass with time.',
  },
  {
    question: 'Does body weight affect edible dosage?',
    answer: 'Body weight can influence how edibles affect you, but it is not the only factor. Metabolism, tolerance, individual endocannabinoid system differences, and whether you have eaten recently all play significant roles. Our calculator uses weight as one of several variables to provide a more personalized recommendation.',
  },
]

export default function DoseCalculatorPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://leefii.com/tools' },
      { '@type': 'ListItem', position: 3, name: 'Edible Dosage Calculator' },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/tools/dose-calculator" className="text-gray-500 hover:text-gray-700">Tools</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Edible Dosage Calculator</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Edible Dosage Calculator</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Not sure how many milligrams of THC to take? Use our free calculator to find the right edible dose
            based on your experience, body weight, and desired intensity.
          </p>
        </div>
      </section>

      {/* Calculator Component */}
      <DoseCalculator />

      {/* SEO Content */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Dose Edibles Safely in 2026</h2>
            <p className="text-gray-700 mb-4">
              Cannabis edibles are one of the most popular ways to consume marijuana, offering a discreet, smoke-free
              experience with longer-lasting effects than inhalation. However, getting the right dose can be tricky,
              especially for those who are new to edibles. Unlike smoking or vaping, where effects are felt almost
              immediately, edibles must pass through the digestive system before reaching the bloodstream, which means
              onset can take anywhere from 30 minutes to over 2 hours.
            </p>
            <p className="text-gray-700 mb-4">
              The golden rule of edible consumption is to start low and go slow. This means beginning with a small dose,
              typically 2.5 to 5 milligrams of THC for beginners, and waiting a full two hours before deciding whether
              to take more. Many first-time edible users make the mistake of taking a second dose too soon because they
              do not feel effects right away, leading to an uncomfortable experience when both doses kick in simultaneously.
            </p>
            <p className="text-gray-700 mb-4">
              Several factors influence how edibles affect you beyond just the milligram dosage. Your body weight,
              metabolism, tolerance level, and even what you have eaten that day can all impact the experience.
              People with faster metabolisms may feel effects sooner, while those who have eaten a large meal might
              experience a delayed onset. Our edible dosage calculator takes your experience level, weight, desired
              intensity, and product type into account to provide a personalized starting recommendation.
            </p>
            <p className="text-gray-700 mb-4">
              Different types of edible products also behave differently. Gummies and chocolates are the most common and
              typically take 30 to 60 minutes to take effect. Baked goods like brownies and cookies can take longer,
              sometimes up to 90 minutes, because they contain more fats that slow digestion. Tinctures, when held
              under the tongue, can bypass part of the digestive system and produce effects in as little as 15 minutes.
              Cannabis beverages, especially those using nano-emulsion technology, are also known for their relatively
              fast onset compared to traditional edibles.
            </p>
            <p className="text-gray-700">
              Whether you are a medical patient seeking consistent symptom relief or a recreational user looking for an
              enjoyable experience, understanding proper dosing is essential for a safe and positive cannabis journey.
              This calculator is designed as a starting point. Always listen to your body, keep track of what works for
              you, and consult a healthcare professional if you have any concerns about how cannabis may interact with
              your health or medications.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
