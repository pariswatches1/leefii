import { Metadata } from 'next'
import Link from 'next/link'
import LawChecker from './LawChecker'

const title = 'Cannabis Law Checker by State — Is Weed Legal in My State? (2026) | Leefii'
const description = 'Check cannabis laws in your state instantly. See if marijuana is legal for recreational or medical use, possession limits, home grow rules, and more. Updated for 2026.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/tools/law-checker', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/tools/law-checker' },
}

const faqs = [
  {
    question: 'How many states have legalized recreational cannabis in 2026?',
    answer: 'As of early 2026, 24 states plus Washington D.C. have legalized recreational cannabis for adults 21 and older. The number continues to grow as more states pass legislation or voter initiatives. Each state has its own specific rules regarding purchase limits, possession amounts, and where you can consume.',
  },
  {
    question: 'Can I travel between states with cannabis?',
    answer: 'No. Transporting cannabis across state lines is a federal offense, even if both states have legalized it. Cannabis remains a Schedule I substance under federal law. This applies to driving, flying, and any other form of interstate transport. Always purchase cannabis in the state where you plan to consume it.',
  },
  {
    question: 'What is the difference between decriminalized and legal?',
    answer: 'Decriminalized means that possessing small amounts of cannabis will not result in jail time or a criminal record, but it is still technically illegal. You may face a civil fine similar to a traffic ticket. Fully legal (or legalized) means that adults can legally purchase, possess, and consume cannabis within the limits set by state law, with licensed retail dispensaries operating legally.',
  },
  {
    question: 'Do I need a medical card in a legal state?',
    answer: 'In states where recreational cannabis is legal, adults 21 and older generally do not need a medical card to purchase or possess cannabis. However, having a medical card can offer advantages including higher possession limits, access to higher potency products, lower tax rates, and the ability to purchase if you are between 18 and 21 years old. Medical cards remain necessary in medical-only states.',
  },
  {
    question: 'Can my employer still drug test me in a legal state?',
    answer: 'Yes, in most states employers can still enforce drug-free workplace policies and conduct drug testing, even where cannabis is legal. However, several states including California, New York, and New Jersey have enacted protections that restrict employers from taking adverse action based solely on off-duty cannabis use or positive THC tests. Always check your specific state and employer policies.',
  },
]

export default function LawCheckerPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://leefii.com/tools' },
      { '@type': 'ListItem', position: 3, name: 'Cannabis Law Checker' },
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
            <Link href="/tools/law-checker" className="text-gray-500 hover:text-gray-700">Tools</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Cannabis Law Checker</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cannabis Law Checker</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Is weed legal in your state? Check the latest cannabis laws including recreational and medical status,
            possession limits, and home cultivation rules.
          </p>
        </div>
      </section>

      {/* Law Checker Component */}
      <LawChecker />

      {/* SEO Content */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Cannabis Laws Across the United States in 2026</h2>
            <p className="text-gray-700 mb-4">
              Cannabis legalization in the United States has undergone a dramatic transformation over the past decade.
              What was once illegal in every state has become a patchwork of different regulations, with each state
              setting its own rules for recreational use, medical access, possession limits, and home cultivation.
              Understanding these laws is essential for anyone who uses cannabis or is considering it, whether you are
              a resident or a visitor.
            </p>
            <p className="text-gray-700 mb-4">
              As of 2026, the majority of US states have some form of legal cannabis access. States with full
              recreational legalization allow adults aged 21 and older to purchase cannabis from licensed dispensaries
              without a medical card. Medical-only states require a qualifying condition and a physician recommendation
              to obtain a medical marijuana card. Some states have decriminalized small amounts of cannabis, meaning
              possession will not result in criminal charges but may still carry civil penalties. A small number of
              states still classify any amount of cannabis possession as a criminal offense.
            </p>
            <p className="text-gray-700 mb-4">
              It is important to understand that cannabis remains illegal at the federal level, classified as a
              Schedule I substance under the Controlled Substances Act. This creates a complex legal landscape where
              state and federal laws conflict. Federal prohibition means that transporting cannabis across state lines
              is always illegal, even between two states where cannabis is fully legal. It also affects banking,
              taxation, and employment law for the cannabis industry and consumers.
            </p>
            <p className="text-gray-700 mb-4">
              Possession limits vary significantly from state to state. In some states, adults can possess up to
              three ounces of flower, while others cap possession at one ounce. Concentrate limits are typically
              lower than flower limits. Home cultivation is permitted in many legal states but not all. New Jersey,
              Washington, and Illinois are notable examples of legal states that restrict or prohibit home growing
              for recreational users.
            </p>
            <p className="text-gray-700">
              Our cannabis law checker tool provides a quick snapshot of the current legal status in each state.
              For detailed information including qualifying medical conditions, dispensary locations, and application
              processes, visit the full state law pages linked in the results. Laws change frequently through
              legislative action and ballot initiatives, so we recommend verifying information with official state
              sources before making any decisions.
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
