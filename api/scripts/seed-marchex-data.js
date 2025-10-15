import { initializeDatabase, createItem, updateItem, queryItems } from '../src/config/database.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Seed script for Marchex (NASDAQ: MCHX) test data
 * Creates a complete organizational structure with CEO and leadership team
 */

const MARCHEX_DATA = {
  company: {
    name: 'Marchex, Inc.',
    ticker: 'MCHX',
    exchange: 'NASDAQ',
    industry: 'Software & Technology',
    sector: 'Application Software',
    founded: 2003,
    headquarters: 'Seattle, Washington',
    website: 'https://www.marchex.com',
    description: 'Marchex is a conversational analytics and solutions company that helps businesses connect, drive, measure and convert callers into customers.',
    employees: 250,
    revenue: '$50M+',
    businessModel: 'B2B SaaS - Conversational Analytics Platform'
  },

  ceo: {
    firstName: 'Michael',
    lastName: 'Arends',
    title: 'Chief Executive Officer',
    email: 'marends@marchex.com',
    phone: '+1-206-331-3300',
    bio: 'Michael A. Arends has served as CEO and a member of the Board of Directors since May 2020. He brings over 25 years of experience in building and scaling technology companies. Prior to Marchex, he served as President and CEO of Impinj, Inc.',
    linkedIn: 'https://www.linkedin.com/in/michaelarends',
    startDate: '2020-05-01',
    responsibilities: [
      'Overall strategic direction and vision',
      'Board relations and investor communications',
      'Executive team leadership',
      'M&A and strategic partnerships',
      'Company culture and values'
    ],
    achievements: [
      'Led Marchex through successful digital transformation',
      'Grew conversational intelligence product line by 150%',
      'Expanded enterprise customer base',
      'Implemented AI/ML capabilities across platform'
    ]
  },

  leadershipTeam: [
    {
      firstName: 'Russell',
      lastName: 'Horowitz',
      title: 'Executive Chairman',
      department: 'Executive',
      email: 'rhorowitz@marchex.com',
      bio: 'Co-founder of Marchex and Executive Chairman. Previously founded Go2Net which was sold to InfoSpace for $4B.',
      linkedIn: 'https://www.linkedin.com/in/russellhorowitz',
      responsibilities: ['Board leadership', 'Strategic guidance', 'Investor relations'],
      yearsWithCompany: 21
    },
    {
      firstName: 'Francis',
      lastName: 'Farnell',
      title: 'Chief Financial Officer',
      department: 'Finance',
      email: 'ffarnell@marchex.com',
      bio: 'CFO responsible for all financial operations, reporting, and strategic planning. Over 20 years of finance leadership experience.',
      responsibilities: ['Financial planning and analysis', 'Investor relations', 'Financial reporting', 'Risk management'],
      yearsWithCompany: 3
    },
    {
      firstName: 'John',
      lastName: 'Remen',
      title: 'Chief Revenue Officer',
      department: 'Sales',
      email: 'jremen@marchex.com',
      bio: 'CRO leading all revenue-generating functions including sales, marketing, and customer success.',
      responsibilities: ['Revenue growth strategy', 'Sales team leadership', 'Customer acquisition', 'Partner relationships'],
      yearsWithCompany: 5
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'Chief Technology Officer',
      department: 'Technology',
      email: 'sjohnson@marchex.com',
      bio: 'CTO overseeing product development, engineering, and technology infrastructure. Leading AI/ML initiatives.',
      responsibilities: ['Technology strategy', 'Product development', 'Engineering teams', 'AI/ML innovation'],
      yearsWithCompany: 4
    },
    {
      firstName: 'David',
      lastName: 'Chen',
      title: 'Chief Product Officer',
      department: 'Product',
      email: 'dchen@marchex.com',
      bio: 'CPO responsible for product strategy, roadmap, and design. Focus on conversational analytics innovation.',
      responsibilities: ['Product strategy', 'Product roadmap', 'User experience', 'Market research'],
      yearsWithCompany: 6
    },
    {
      firstName: 'Jennifer',
      lastName: 'Martinez',
      title: 'Chief Marketing Officer',
      department: 'Marketing',
      email: 'jmartinez@marchex.com',
      bio: 'CMO driving brand strategy, demand generation, and market positioning.',
      responsibilities: ['Brand strategy', 'Demand generation', 'Content marketing', 'Public relations'],
      yearsWithCompany: 2
    },
    {
      firstName: 'Robert',
      lastName: 'Thompson',
      title: 'VP of Customer Success',
      department: 'Customer Success',
      email: 'rthompson@marchex.com',
      bio: 'Leading customer success, support, and professional services teams. Focused on customer retention and expansion.',
      responsibilities: ['Customer satisfaction', 'Onboarding programs', 'Support operations', 'Customer expansion'],
      yearsWithCompany: 7
    },
    {
      firstName: 'Amanda',
      lastName: 'Williams',
      title: 'VP of People & Culture',
      department: 'Human Resources',
      email: 'awilliams@marchex.com',
      bio: 'Leading HR strategy, talent acquisition, and organizational development.',
      responsibilities: ['Talent management', 'Culture initiatives', 'Compensation & benefits', 'Learning & development'],
      yearsWithCompany: 3
    }
  ]
};

async function seedMarchexData() {
  console.log('🌱 Starting Marchex seed data generation...\n');

  try {
    // Initialize database
    await initializeDatabase();

    // 1. Create Marchex Organization
    console.log('📊 Creating Marchex organization...');
    const orgId = `org_${uuidv4()}`;
    const organization = {
      id: orgId,
      type: 'organization',
      name: MARCHEX_DATA.company.name,
      ticker: MARCHEX_DATA.company.ticker,
      exchange: MARCHEX_DATA.company.exchange,
      industry: MARCHEX_DATA.company.industry,
      sector: MARCHEX_DATA.company.sector,
      founded: MARCHEX_DATA.company.founded,
      headquarters: MARCHEX_DATA.company.headquarters,
      website: MARCHEX_DATA.company.website,
      description: MARCHEX_DATA.company.description,
      companySize: MARCHEX_DATA.company.employees,
      revenue: MARCHEX_DATA.company.revenue,
      businessModel: MARCHEX_DATA.company.businessModel,
      ownerEmail: MARCHEX_DATA.ceo.email,
      plan: 'enterprise',
      status: 'active',
      subscription: {
        plan: 'enterprise',
        status: 'active',
        startDate: '2025-01-01T00:00:00Z',
        currentPeriodEnd: '2026-01-01T00:00:00Z'
      },
      settings: {
        maxUsers: 100,
        maxAssessments: 500,
        features: ['ai-coaching', '360-review', 'benchmarking', 'custom-branding', 'api-access'],
        branding: {
          primaryColor: '#0066CC',
          logo: 'https://www.marchex.com/logo.png'
        }
      },
      metadata: {
        ownerId: null, // Will be set after CEO user is created
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await createItem('organizations', organization);
    console.log(`✓ Organization created: ${organization.name} (${orgId})\n`);

    // 2. Create CEO User
    console.log('👔 Creating CEO profile...');
    const ceoId = `user_${uuidv4()}`;
    const ceoUser = {
      id: ceoId,
      type: 'user',
      organizationId: orgId,
      email: MARCHEX_DATA.ceo.email,
      auth0Id: null, // Will be set when CEO logs in via Auth0
      passwordHash: null, // Auth0 handles authentication
      profile: {
        firstName: MARCHEX_DATA.ceo.firstName,
        lastName: MARCHEX_DATA.ceo.lastName,
        fullName: `${MARCHEX_DATA.ceo.firstName} ${MARCHEX_DATA.ceo.lastName}`,
        title: MARCHEX_DATA.ceo.title,
        department: 'Executive',
        phone: MARCHEX_DATA.ceo.phone,
        bio: MARCHEX_DATA.ceo.bio,
        linkedIn: MARCHEX_DATA.ceo.linkedIn,
        avatar: null,
        startDate: MARCHEX_DATA.ceo.startDate,
        isCEO: true,
        isLeadership: true,
        reportingTo: null // CEO reports to board
      },
      role: 'ceo',
      permissions: {
        canCreateAssessments: true,
        canViewReports: true,
        canViewAllAssessments: true,
        canManageTeam: true,
        canManageBilling: true,
        canManageOrganization: true,
        canInviteUsers: true,
        canExportData: true,
        canAccessAPI: true,
        canConfigureIntegrations: true
      },
      responsibilities: MARCHEX_DATA.ceo.responsibilities,
      achievements: MARCHEX_DATA.ceo.achievements,
      status: 'active',
      metadata: {
        lastLogin: null,
        loginCount: 0,
        timezone: 'America/Los_Angeles',
        locale: 'en-US',
        notificationPreferences: {
          email: true,
          inApp: true,
          sms: false
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await createItem('users', ceoUser);
    console.log(`✓ CEO created: ${ceoUser.profile.fullName} (${ceoUser.profile.title})\n`);

    // Update organization with CEO as owner
    await updateItem('organizations', orgId, orgId, {
      'metadata.ownerId': ceoId
    });

    // 3. Create Leadership Team
    console.log('👥 Creating leadership team members...\n');
    const leadershipUsers = [];

    for (const member of MARCHEX_DATA.leadershipTeam) {
      const userId = `user_${uuidv4()}`;
      const user = {
        id: userId,
        type: 'user',
        organizationId: orgId,
        email: member.email,
        auth0Id: null,
        passwordHash: null,
        profile: {
          firstName: member.firstName,
          lastName: member.lastName,
          fullName: `${member.firstName} ${member.lastName}`,
          title: member.title,
          department: member.department,
          phone: null,
          bio: member.bio,
          linkedIn: member.linkedIn || null,
          avatar: null,
          startDate: null,
          isCEO: false,
          isLeadership: true,
          reportingTo: member.title === 'Executive Chairman' ? null : ceoId,
          yearsWithCompany: member.yearsWithCompany
        },
        role: member.title.toLowerCase().includes('chief') || member.title.toLowerCase().includes('chairman') ? 'executive' : 'manager',
        permissions: {
          canCreateAssessments: true,
          canViewReports: true,
          canViewAllAssessments: member.title.toLowerCase().includes('chief'),
          canManageTeam: true,
          canManageBilling: member.title.toLowerCase().includes('cfo'),
          canManageOrganization: member.title.toLowerCase().includes('chief'),
          canInviteUsers: true,
          canExportData: true,
          canAccessAPI: member.title.toLowerCase().includes('cto'),
          canConfigureIntegrations: false
        },
        responsibilities: member.responsibilities,
        status: 'active',
        metadata: {
          lastLogin: null,
          loginCount: 0,
          timezone: 'America/Los_Angeles',
          locale: 'en-US',
          notificationPreferences: {
            email: true,
            inApp: true,
            sms: false
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createItem('users', user);
      leadershipUsers.push(user);
      console.log(`  ✓ ${user.profile.fullName} - ${user.profile.title}`);
    }

    console.log(`\n✓ ${leadershipUsers.length} leadership team members created\n`);

    // 4. Create sample assessment for Marchex
    console.log('📋 Creating sample Q4 2024 Strategic Assessment...');
    const assessmentId = `assessment_${uuidv4()}`;
    const assessment = {
      id: assessmentId,
      type: 'assessment',
      organizationId: orgId,
      name: 'Marchex Q4 2024 Strategic Assessment',
      description: 'Comprehensive 9 Vectors strategic review for Q4 2024',
      status: 'draft',
      createdBy: ceoId,
      createdAt: new Date().toISOString(),
      dueDate: '2024-12-31T23:59:59Z',
      assessmentType: 'strategic-review',
      participants: [
        {
          userId: ceoId,
          role: 'owner',
          status: 'not-started',
          invitedAt: new Date().toISOString()
        },
        ...leadershipUsers.map(user => ({
          userId: user.id,
          role: 'participant',
          status: 'not-started',
          invitedAt: new Date().toISOString()
        }))
      ],
      configuration: {
        enableAICoaching: true,
        enableBenchmarking: true,
        anonymousResponses: false,
        requiredVectors: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        allowComments: true,
        allowDocumentUpload: true
      },
      vectors: [
        { id: 1, name: 'Market', completed: false },
        { id: 2, name: 'Product/Service', completed: false },
        { id: 3, name: 'Finance', completed: false },
        { id: 4, name: 'Strategy', completed: false },
        { id: 5, name: 'Operations', completed: false },
        { id: 6, name: 'People', completed: false },
        { id: 7, name: 'Sales & Marketing', completed: false },
        { id: 8, name: 'Technology', completed: false },
        { id: 9, name: 'Risk & Compliance', completed: false }
      ],
      analytics: {
        completionRate: 0,
        avgTimeToComplete: 0,
        totalResponses: 0,
        lastUpdated: new Date().toISOString()
      },
      metadata: {
        quarter: 'Q4',
        year: 2024,
        fiscalYear: 2024
      },
      updatedAt: new Date().toISOString()
    };

    await createItem('assessments', assessment);
    console.log(`✓ Assessment created: ${assessment.name}\n`);

    // 5. Print Summary
    console.log('═'.repeat(60));
    console.log('✅ MARCHEX DATA SEEDED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    console.log(`\n📊 Organization: ${organization.name}`);
    console.log(`   ID: ${orgId}`);
    console.log(`   Ticker: ${organization.ticker}`);
    console.log(`   Plan: ${organization.plan}`);
    console.log(`\n👔 CEO: ${ceoUser.profile.fullName}`);
    console.log(`   Email: ${ceoUser.email}`);
    console.log(`   ID: ${ceoId}`);
    console.log(`\n👥 Leadership Team: ${leadershipUsers.length} members`);
    leadershipUsers.forEach(user => {
      console.log(`   - ${user.profile.fullName} (${user.profile.title})`);
    });
    console.log(`\n📋 Sample Assessment Created`);
    console.log(`   Name: ${assessment.name}`);
    console.log(`   Participants: ${assessment.participants.length}`);
    console.log(`\n🔐 Next Steps:`);
    console.log(`   1. CEO can log in with: ${ceoUser.email}`);
    console.log(`   2. Leadership team members can be invited via email`);
    console.log(`   3. Assessment can be launched and completed`);
    console.log(`   4. Results will show organization benchmarking\n`);

  } catch (error) {
    console.error('❌ Error seeding Marchex data:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the seed script
seedMarchexData();
