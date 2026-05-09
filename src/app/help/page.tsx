'use client';

import React, { useState } from 'react';
import { Header, Sidebar } from '../../components/common';
import Icon from '@/components/ui/AppIcon';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'pdf' | 'link';
  url: string;
  category: string;
}

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'guides' | 'contact' | 'support'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a new compliance policy?',
      answer: 'To create a new compliance policy, navigate to the Policy Management Center from the sidebar, click the "Create New Policy" button, fill in the required details including policy name, description, framework, and effective dates. You can also upload supporting documents and assign reviewers.',
      category: 'policies'
    },
    {
      id: '2',
      question: 'What is the difference between high, medium, and low risk levels?',
      answer: 'Risk levels are categorized based on potential impact and likelihood. High risk indicates significant potential impact requiring immediate attention, medium risk needs monitoring and mitigation plans, while low risk requires periodic review but poses minimal threat to compliance objectives.',
      category: 'risk'
    },
    {
      id: '3',
      question: 'How can I track compliance task deadlines?',
      answer: 'Compliance task deadlines can be tracked through the Tasks Management dashboard. You\'ll see upcoming deadlines, overdue tasks, and can set up email notifications and reminders. The calendar view provides a visual timeline of all compliance activities.',
      category: 'tasks'
    },
    {
      id: '4',
      question: 'How do I generate compliance reports?',
      answer: 'Reports can be generated from the Analytics Dashboard. Select the report type (compliance score, audit findings, risk assessment), choose your date range and filters, then click "Generate Report". You can export reports in PDF, Excel, or CSV formats.',
      category: 'reporting'
    },
    {
      id: '5',
      question: 'What should I do if I discover a compliance incident?',
      answer: 'Immediately report the incident using the Incident Reporting System. Provide detailed information about what happened, when it occurred, potential impact, and any immediate actions taken. The system will automatically notify relevant stakeholders based on incident severity.',
      category: 'incidents'
    },
    {
      id: '6',
      question: 'How can I manage user permissions and access?',
      answer: 'User permissions are managed through the User Access Management section. You can assign roles, modify permissions, create access groups, and review user activity. Changes to permissions require administrator approval and are logged for audit purposes.',
      category: 'access'
    }
  ];

  const helpResources: HelpResource[] = [
    {
      id: '1',
      title: 'Getting Started with ComplianceHub',
      description: 'Complete guide for new users covering basic navigation, key features, and initial setup',
      type: 'guide',
      url: '/guides/getting-started',
      category: 'general'
    },
    {
      id: '2',
      title: 'Policy Management Best Practices',
      description: 'Learn how to create, manage, and maintain effective compliance policies',
      type: 'pdf',
      url: '/resources/policy-management.pdf',
      category: 'policies'
    },
    {
      id: '3',
      title: 'Risk Assessment Tutorial',
      description: 'Video walkthrough of conducting risk assessments and creating mitigation plans',
      type: 'video',
      url: '/tutorials/risk-assessment',
      category: 'risk'
    },
    {
      id: '4',
      title: 'Audit Trail Configuration',
      description: 'Step-by-step guide to setting up and managing audit trails',
      type: 'guide',
      url: '/guides/audit-trail',
      category: 'audits'
    },
    {
      id: '5',
      title: 'Advanced Reporting Features',
      description: 'Learn to create custom reports and dashboards for compliance tracking',
      type: 'video',
      url: '/tutorials/advanced-reporting',
      category: 'reporting'
    },
    {
      id: '6',
      title: 'Integration Setup Guide',
      description: 'Configure third-party integrations and API connections',
      type: 'guide',
      url: '/guides/integrations',
      category: 'integrations'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'general', label: 'General' },
    { value: 'policies', label: 'Policies' },
    { value: 'risk', label: 'Risk Management' },
    { value: 'tasks', label: 'Task Management' },
    { value: 'audits', label: 'Audits' },
    { value: 'reporting', label: 'Reporting' },
    { value: 'incidents', label: 'Incidents' },
    { value: 'access', label: 'Access Management' },
    { value: 'integrations', label: 'Integrations' }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredResources = helpResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'guide': return 'BookOpenIcon';
      case 'video': return 'PlayCircleIcon';
      case 'pdf': return 'DocumentTextIcon';
      case 'link': return 'LinkIcon';
      default: return 'DocumentIcon';
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'guide': return 'text-blue-600 bg-blue-100';
      case 'video': return 'text-purple-600 bg-purple-100';
      case 'pdf': return 'text-red-600 bg-red-100';
      case 'link': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
              <p className="text-muted-foreground">
                Find answers, guides, and get support for ComplianceHub
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-card rounded-xl border border-border shadow-soft mb-8 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon
                      name="MagnifyingGlassIcon"
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Search for help topics, guides, or questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Help Content */}
            <div className="bg-card rounded-xl border border-border shadow-soft">
              {/* Tab Navigation */}
              <div className="px-6 py-4 border-b border-border">
                <nav className="flex space-x-6">
                  <button
                    onClick={() => setActiveTab('faq')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'faq' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="QuestionMarkCircleIcon" size={16} />
                    <span>FAQ</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('guides')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'guides' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="BookOpenIcon" size={16} />
                    <span>Guides & Tutorials</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'contact' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="ChatBubbleLeftRightIcon" size={16} />
                    <span>Contact Support</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('support')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === 'support' ?'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon name="LifebuoyIcon" size={16} />
                    <span>System Status</span>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq) => (
                        <div
                          key={faq.id}
                          className="border border-border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                            className="w-full px-6 py-4 text-left bg-muted/30 hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between"
                          >
                            <span className="font-medium text-foreground">{faq.question}</span>
                            <Icon
                              name="ChevronDownIcon"
                              size={20}
                              className={`text-muted-foreground transition-transform duration-200 ${
                                expandedFAQ === faq.id ? 'transform rotate-180' : ''
                              }`}
                            />
                          </button>
                          {expandedFAQ === faq.id && (
                            <div className="px-6 py-4 bg-card">
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Icon name="MagnifyingGlassIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No FAQ items found matching your search.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'guides' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="p-6 border border-border rounded-lg hover:shadow-soft transition-all duration-200 cursor-pointer group"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getResourceColor(resource.type)}`}>
                              <Icon name={getResourceIcon(resource.type)} size={24} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {resource.description}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceColor(resource.type)}`}>
                                  {resource.type.toUpperCase()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {categories.find(c => c.value === resource.category)?.label}
                                </span>
                              </div>
                            </div>
                            <Icon name="ArrowTopRightOnSquareIcon" size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12">
                        <Icon name="BookOpenIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No guides found matching your search.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">Live Chat</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Get instant help from our support team during business hours.
                        </p>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
                          Start Chat
                        </button>
                      </div>

                      <div className="p-6 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon name="EnvelopeIcon" size={20} className="text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">Email Support</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Send us a detailed message and we'll get back to you within 24 hours.
                        </p>
                        <p className="text-sm font-medium text-foreground">support@compliancehub.com</p>
                      </div>

                      <div className="p-6 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon name="PhoneIcon" size={20} className="text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">Phone Support</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Call us for urgent issues or complex technical support.
                        </p>
                        <p className="text-sm font-medium text-foreground">+1 (555) 123-HELP</p>
                        <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9 AM - 6 PM EST</p>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Send us a Message</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input"
                            placeholder="Brief description of your issue"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                          <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input">
                            <option>Technical Issue</option>
                            <option>Feature Request</option>
                            <option>Account Question</option>
                            <option>Training Request</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                          <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Urgent</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                          <textarea
                            rows={6}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-input resize-none"
                            placeholder="Please provide as much detail as possible about your issue..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <Icon name="PaperAirplaneIcon" size={16} />
                          <span>Send Message</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h3 className="font-semibold text-green-800">All Systems Operational</h3>
                        </div>
                        <p className="text-sm text-green-700">All ComplianceHub services are running normally.</p>
                      </div>

                      <div className="p-6 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">Uptime</h3>
                        <p className="text-2xl font-bold text-primary">99.9%</p>
                        <p className="text-sm text-muted-foreground">Last 30 days</p>
                      </div>

                      <div className="p-6 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                        <p className="text-2xl font-bold text-primary">1.2s</p>
                        <p className="text-sm text-muted-foreground">Average API response</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Updates</h3>
                      <div className="space-y-4">
                        {[
                          {
                            id: '1',
                            date: '2024-11-14',
                            title: 'Enhanced Risk Assessment Features',
                            description: 'Added new risk calculation algorithms and improved visualization.',
                            type: 'feature'
                          },
                          {
                            id: '2',
                            date: '2024-11-12',
                            title: 'Performance Improvements',
                            description: 'Optimized database queries for faster dashboard loading.',
                            type: 'improvement'
                          },
                          {
                            id: '3',
                            date: '2024-11-10',
                            title: 'Security Update',
                            description: 'Applied latest security patches and enhanced encryption.',
                            type: 'security'
                          }
                        ].map((update) => (
                          <div key={update.id} className="p-4 border border-border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{update.title}</h4>
                              <span className="text-sm text-muted-foreground">{update.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{update.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;