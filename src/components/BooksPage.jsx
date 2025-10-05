import React, { useState } from 'react';
import { BookOpen, ExternalLink, Award, TrendingUp, Target, Zap, ShoppingCart, Download, CreditCard, Check, Info } from 'lucide-react';

function BooksPage() {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(null);

  const books = [
    {
      id: 1,
      title: '9Lenses: A Framework for Business Success',
      subtitle: 'The Complete Methodology Book',
      description: 'Master the complete 9Lenses framework with in-depth analysis of all 9 lenses, 44 sub-lenses, and 242+ themes. Includes case studies, implementation guides, and assessment templates.',
      icon: Target,
      color: 'primary',
      type: 'eBook',
      price: 49.99,
      stripeLink: 'https://buy.stripe.com/test_9lenses_book', // Replace with actual Stripe link
      downloadUrl: '/downloads/9lenses-framework.pdf',
      features: [
        'Complete framework methodology',
        'All 9 lenses explained in detail',
        '44 sub-lenses with examples',
        '242+ themes and questions',
        'Case studies and templates',
        'Digital PDF format'
      ]
    },
    {
      id: 2,
      title: 'Snapshot9: Business Model Analysis',
      subtitle: 'Touch, Volume, Margin Framework',
      description: 'Revolutionary approach to business model analysis using the Snapshot9 framework. Understand how Touch, Volume, and Margin drive business success.',
      icon: Zap,
      color: 'orange',
      type: 'eBook',
      price: 39.99,
      stripeLink: 'https://buy.stripe.com/test_snapshot9_book', // Replace with actual Stripe link
      downloadUrl: '/downloads/snapshot9-methodology.pdf',
      features: [
        'Touch, Volume, Margin explained',
        'Business model canvas integration',
        'Real-world examples',
        'Strategic planning templates',
        'Financial modeling tools',
        'Digital PDF format'
      ]
    },
    {
      id: 3,
      title: 'Complete 9Lenses Bundle',
      subtitle: 'Both Books + Bonus Materials',
      description: 'Get both the 9Lenses Framework and Snapshot9 books plus exclusive bonus materials including assessment templates, strategic planning worksheets, and video tutorials.',
      icon: Award,
      color: 'secondary',
      type: 'Bundle',
      price: 79.99,
      originalPrice: 89.98,
      stripeLink: 'https://buy.stripe.com/test_9lenses_bundle', // Replace with actual Stripe link
      downloadUrl: '/downloads/9lenses-complete-bundle.zip',
      features: [
        'Both books included',
        'Assessment templates library',
        'Strategic planning worksheets',
        'Video tutorial series (2 hours)',
        'Implementation checklists',
        'Lifetime updates'
      ],
      isBestValue: true
    }
  ];

  const freeResources = [
    {
      title: 'Getting Started Guide',
      description: 'Quick introduction to 9Lenses methodology and how to get started',
      icon: BookOpen,
      type: 'Free PDF',
      downloadUrl: '/downloads/getting-started.pdf'
    },
    {
      title: 'Assessment Template',
      description: 'Basic assessment template for conducting your first 9Lenses review',
      icon: TrendingUp,
      type: 'Free Template',
      downloadUrl: '/downloads/assessment-template.xlsx'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-600',
      orange: 'bg-orange-600',
      secondary: 'bg-secondary-600'
    };
    return colors[color] || 'bg-primary-600';
  };

  const handlePurchase = async (book) => {
    setIsProcessing(book.id);

    // Simulate Stripe checkout
    // In production, this would redirect to Stripe Checkout
    setTimeout(() => {
      // Simulate successful purchase
      setPurchasedItems([...purchasedItems, book.id]);
      setIsProcessing(null);

      // In production, this would be handled by Stripe webhook
      alert(`Purchase successful! You can now download "${book.title}"`);
    }, 2000);
  };

  const handleDownload = (url, title) => {
    // In production, this would trigger actual file download
    alert(`Downloading: ${title}\nThis would download from: ${url}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-secondary-700 via-primary-700 to-orange-700 rounded-3xl p-12 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold">Books & Resources</h1>
              <p className="text-xl text-white/90 mt-2">Master the 9Lenses methodology with our comprehensive books and guides</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-white/10 backdrop-blur-sm border-l-4 border-white rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/90">
                  <span className="font-semibold">Secure payment via Stripe</span> • Instant digital download • Lifetime access to purchased materials
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Books */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Premium Books & Bundles</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const Icon = book.icon;
            const isPurchased = purchasedItems.includes(book.id);
            const isProcessingThis = isProcessing === book.id;

            return (
              <div
                key={book.id}
                className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all hover:shadow-2xl ${
                  book.isBestValue ? 'border-orange-400' : 'border-gray-200'
                }`}
              >
                {book.isBestValue && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                    BEST VALUE
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 ${getColorClasses(book.color)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{book.type}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{book.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">{book.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {book.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {book.originalPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">${book.originalPrice}</span>
                        )}
                        <span className="text-3xl font-bold text-gray-900">${book.price}</span>
                      </div>
                      {book.originalPrice && (
                        <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                          Save ${(book.originalPrice - book.price).toFixed(2)}
                        </div>
                      )}
                    </div>

                    {isPurchased ? (
                      <button
                        onClick={() => handleDownload(book.downloadUrl, book.title)}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 group"
                      >
                        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Download Now
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(book)}
                        disabled={isProcessingThis}
                        className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 group ${
                          isProcessingThis
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {isProcessingThis ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Buy Now with Stripe
                            <CreditCard className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Free Resources */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Free Resources</h2>
        <p className="text-gray-600 mb-6">Get started with these free downloads - no purchase required</p>

        <div className="grid md:grid-cols-2 gap-4">
          {freeResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded font-semibold">
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <button
                      onClick={() => handleDownload(resource.downloadUrl, resource.title)}
                      className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Free
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stripe Info */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Payment Information</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Secure Checkout</h4>
              <p className="text-sm text-gray-600">All payments processed securely through Stripe with 256-bit SSL encryption</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Instant Download</h4>
              <p className="text-sm text-gray-600">Immediate access to your purchased materials after payment confirmation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Lifetime Access</h4>
              <p className="text-sm text-gray-600">Download your materials anytime, receive free updates and new versions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
