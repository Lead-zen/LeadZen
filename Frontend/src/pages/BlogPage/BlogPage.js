import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [visibleBlogs, setVisibleBlogs] = useState(8); // Show 8 blogs initially
  const [isLoading, setIsLoading] = useState(false);
  const [likedBlogs, setLikedBlogs] = useState(new Set()); // Track liked blog IDs
  const [blogLikes, setBlogLikes] = useState({}); // Track like counts for each blog

  // Comprehensive blog data including all blogs from homepage plus additional content
  const blogData = [
    {
      id: 'founder-dilemma',
      title: 'Should you build a product first or find customers first? A Founder\'s dilemma explained',
      author: 'Evecta Team',
      date: '15 Dec 2024',
      readTime: '8 minute read',
      category: 'Strategy',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format',
      featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&auto=format',
      excerpt: 'Every founder faces this question at the start: Should I spend months building my product first, or should I focus on finding customers before I build?',
      content: {
        introduction: `Every founder faces this question at the start: Should I spend months building my product first, or should I focus on finding customers before I build?

It sounds like a chicken-and-egg problem. Without a product, how do you get customers? But without customers, how do you know if the product is worth building?

This dilemma has caused many startups to waste time, burn money, and even fail. So let us break it down logically.`,
        sections: [
          {
            title: 'Why building first feels tempting',
            subsections: [
              {
                title: 'The Appeal of Building First',
                content: `Many founders start by building. After all, you want something tangible to show.

It feels like progress.

You can showcase a demo or MVP.

You control the process.

But here is the risk: you might spend months building a product only to find that it's not something people actually want. Startups that die quietly usually do not fail because of "bad code." They fail because they were built in isolation, without real customer validation.`
              }
            ]
          },
          {
            title: 'Why Finding Customers First Makes Sense',
            subsections: [
              {
                title: 'Customer Validation is Key',
                content: `Successful founders know that customers are the real validation. If no one is willing to pay, the product is just an idea.

Talking to customers early reveals what problems they actually care about.

You avoid building features no one needs.

You save time and money by focusing on the right solution.

Finding customers first does not mean you must sell a finished product. It can mean pre-orders, waitlists, or even simple conversations that prove demand.`
              }
            ]
          },
          {
            title: 'The Balanced Approach: Build While You Validate',
            subsections: [
              {
                title: 'Combining Both Strategies',
                content: `The best path is not choosing one side blindly. It is combining both.

Start with conversations and discovery to find your audience.

Build a simple MVP or prototype that solves their biggest pain point.

Iterate with customer feedback as you go.

This way, you are not building in the dark, but you are also not waiting forever to launch.`
              }
            ]
          },
          {
            title: 'How Evecta Helps in This Dilemma',
            subsections: [
              {
                title: 'Making Customer Discovery Practical',
                content: `This is exactly where many founders struggle — finding the right customers. You may have the passion and the idea, but how do you connect with the audience that truly needs it?

That is what Evecta is built for. Instead of wasting weeks searching Google, scrolling LinkedIn, or buying stale lists, you can:

Search industries instantly.

Discover decision-makers inside those businesses.

Get enriched, real-time lead data in one click.

Evecta makes the "find customers first" path practical and fast. You validate your idea earlier, build with confidence, and avoid the trap of launching a product into silence.`
              }
            ]
          },
          {
            title: 'Final Thought',
            subsections: [
              {
                title: 'The Path to Success',
                content: `The founder's dilemma is real: build first or find customers first. But if you look at the startups that succeed, the answer is clear. They find customers early, listen closely, and build what people are already waiting for.

An idea alone is not enough. A product alone is not enough. The right customers are what turn both into income.

And finding those customers no longer has to be chaos — with Evecta, you discover them in seconds, so you can focus on building what matters.`
              }
            ]
          }
        ]
      }
    },
    {
      id: 'quality-vs-quantity',
      title: 'More Leads ≠ More Sales: Why Quality Beats Quantity Every Time',
      author: 'Evecta Team',
      date: '12 Dec 2024',
      readTime: '7 minute read',
      category: 'Strategy',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format',
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format',
      excerpt: 'When it comes to business growth, many founders obsess over one metric: the number of leads generated. But here\'s the truth that most startups learn the hard way: more leads don\'t always mean more sales.',
      content: {
        introduction: `When it comes to business growth, many founders obsess over one metric: the number of leads generated. It's easy to assume that if you just keep filling the pipeline with more names and email addresses, sales will eventually skyrocket. But here's the truth that most startups learn the hard way: more leads don't always mean more sales.

Focusing solely on lead volume can slow down your sales cycle, overwhelm your team, and drain resources. The smarter strategy is simple: prioritize quality over quantity. The victors in today's market aren't the ones with the biggest list. They're the ones with the right list.`,
        sections: [
          {
            title: 'The Illusion of "More"',
            subsections: [
              {
                title: 'The Problem with Lead Volume',
                content: `Imagine pouring thousands of unqualified contacts into your CRM. Your sales reps spend hours chasing them, only to realize most have no interest, no budget, or no authority to buy. This creates what we call lead pollution — lots of noise but little real opportunity.

The illusion is comforting: "We have 10,000 leads this month!" However, the conversion rate tells a darker story: less than 1% actually make a purchase. That means time wasted, higher costs, and frustrated sales teams.`
              }
            ]
          },
          {
            title: 'Why Quality Wins Every Time',
            subsections: [
              {
                title: '1. Better Conversion Rates',
                content: `A smaller pool of well-researched, targeted leads almost always converts at a higher percentage. Ten highly qualified prospects can outperform a thousand random ones.`
              },
              {
                title: '2. Shorter Sales Cycles',
                content: `When you talk to people who already fit your buyer profile, they need less convincing. Instead of weeks of nurturing, they're ready to engage and make decisions faster.`
              },
              {
                title: '3. Lower Acquisition Costs',
                content: `Chasing unqualified leads means burning money on ads, outreach, and manpower. Focusing on quality reduces wasted effort and lowers your overall cost per acquisition (CPA).`
              },
              {
                title: '4. Stronger Customer Relationships',
                content: `Quality leads usually mean the right fit — businesses that actually benefit from your product. These customers stick around longer, buy more, and often become brand advocates.`
              }
            ]
          },
          {
            title: 'How to Shift from Quantity to Quality',
            subsections: [
              {
                title: 'Define Your Ideal Customer Profile (ICP)',
                content: `Go beyond demographics. Think industry, pain points, buying triggers, and decision-making authority.`
              },
              {
                title: 'Leverage Smarter Data',
                content: `Use AI-powered tools (like our platform) to enrich lead data, verify accuracy, and flag high-intent contacts.`
              },
              {
                title: 'Score Your Leads',
                content: `Not all leads are equal. Implement a scoring system that ranks prospects by fit and engagement level.`
              },
              {
                title: 'Personalize Outreach',
                content: `Quality leads deserve quality messaging. Tailor emails and content to their specific challenges instead of blasting generic campaigns.`
              }
            ]
          },
          {
            title: 'Final Word: Stop Chasing Numbers',
            subsections: [
              {
                title: 'Focus on Precision',
                content: `In sales, bigger isn't always better. The real winners are teams that focus on precision. Ten right conversations beat a thousand unsuited ones every single time.

That's why our platform is built with one promise: to deliver leads that don't just fill your CRM, but actually grow your revenue.`
              }
            ]
          }
        ]
      }
    },
    {
      id: 'ai-lead-discovery',
      title: 'How AI changes the way you discover Leads',
      author: 'Evecta Team',
      date: '10 Dec 2024',
      readTime: '6 minute read',
      category: 'Technology',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format',
      featuredImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop&auto=format',
      excerpt: 'Not long ago, finding leads meant scrolling through endless directories, buying questionable email lists, or relying on gut instinct. But today, AI is rewriting the rulebook.',
      content: {
        introduction: `Not long ago, finding leads meant scrolling through endless directories, buying questionable email lists, or relying on gut instinct. It was slow, repetitive, and full of guesswork.

But today, AI is rewriting the rulebook. Instead of manually searching for potential customers, businesses can now let smart algorithms do the heavy lifting. The result? Faster, smarter, and higher-quality lead discovery.`,
        sections: [
          {
            title: 'The Old Way vs. The AI Way',
            subsections: [
              {
                title: 'Transformation in Lead Discovery',
                content: `Old Way:
- Searching industry by industry on Google or LinkedIn
- Manually checking websites for contact info
- Stale, inaccurate data, and forcing manual updates
- Outdated, inconsistent lead lists

AI Way:
- Scans your chosen industry in seconds
- Qualifies leads automatically
- AI refreshes your data in real-time for up-to-date information
- AI keeps data fresh and accurate`
              }
            ]
          },
          {
            title: '4 Ways AI is Transforming Lead Discovery',
            subsections: [
              {
                title: '1. AI finds Leads you didn\'t know existed',
                content: `Instead of chasing random lists, AI scans your chosen industries directly. Whether it's coffee shops in Australia or tech startups in Nepal, you get a focused pool of businesses that match your target market.`
              },
              {
                title: '2. Data-enriched real-time updates',
                content: `Markets change fast. That "cold" lead you ignored yesterday might have just raised funding, hired a new manager, or expanded into your target region today. Without real-time updates, you miss the window. With AI, you see the shift the moment it happens and reach out while competitors are still in the dark.`
              },
              {
                title: '3. AI keeps you ahead, not just updated',
                content: `Not all leads are equal. AI can highlight which companies show higher potential, so you know exactly where to focus first.`
              },
              {
                title: '4. Personalization at Scale',
                content: `Instead of blasting the same pitch to everyone, AI helps tailor your outreach. It can suggest the right messaging based on a prospect's industry, role, or recent activity.`
              }
            ]
          },
          {
            title: 'Why This Matters for You',
            subsections: [
              {
                title: 'The Benefits of AI-Powered Discovery',
                content: `No More Blind Searching → You don't waste time clicking through endless Google or LinkedIn results.

Save Time & Money → Hours of manual research shrink to seconds, letting you focus on selling, not searching.

Stay Ahead of Competitors → While others chase random leads, you build a pipeline of quality opportunities.`
              }
            ]
          },
          {
            title: 'Final Thought',
            subsections: [
              {
                title: 'AI as Your Sales Advantage',
                content: `AI doesn't replace salespeople. It makes them smarter, faster, and more focused. The companies winning today aren't the ones with the biggest lists — they're the ones using AI to find the right people at the right time.

That's exactly what we're building into our platform: AI-powered lead discovery that turns endless searching into meaningful sales opportunities.`
              }
            ]
          }
        ]
      }
    },
    {
      id: 'lead-generation-chaos',
      title: 'Lead Generation Without the Chaos: From 15 Tabs to Just 1 Click',
      author: 'Evecta Team',
      date: '8 Dec 2024',
      readTime: '5 minute read',
      category: 'Technology',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&auto=format',
      featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop&auto=format',
      excerpt: 'Let\'s be honest — lead generation often feels like detective work. You sit down at your desk, coffee in hand, ready to find new customers. By noon, your screen looks like a battlefield of 15 open tabs.',
      content: {
        introduction: `Let's be honest — lead generation often feels like detective work.

You sit down at your desk, coffee in hand, ready to find new customers. You open Google. Then LinkedIn. Then a company website. Then another tab to copy into your spreadsheet. Then, another tool to find emails.

By noon, your screen looks like a battlefield of 15 open tabs. You're jumping back and forth, chasing down scraps of information, hoping it all adds up to something useful.`,
        sections: [
          {
            title: 'The Everyday Struggle',
            subsections: [
              {
                title: 'The Chaos of Manual Lead Generation',
                content: `One tab has LinkedIn profiles.

Another has company websites.

Your spreadsheet is somewhere behind ten other windows.

Email finder tools are half-working, half-broken.

And you're thinking: "Why does this feel harder than closing the deal itself?"

The chaos isn't just annoying — it slows you down, drains your focus, and makes lead generation a task you dread.`
              }
            ]
          },
          {
            title: 'Imagine This Instead, From 15 Tabs to 1 Click with Evecta',
            subsections: [
              {
                title: 'A Streamlined Solution',
                content: `We know the chaos — endless Googling, LinkedIn rabbit holes, copy-pasting into spreadsheets, and praying your email finder works. By lunch, you've got a mess of tabs open and nothing you fully trust.

This is exactly why we built Evecta. Instead of juggling tools, Evecta puts everything into one place:

Search by Industry → Want coffee shops in Australia? SaaS startups in the US? Just type it in, and they appear.

Data Enrichment → Evecta auto-fills details like company size, location, and roles.

Real-Time Updates → Forget stale spreadsheets. Your leads stay alive and accurate, ready when you are.

What used to take you an entire morning across 15 tabs is now ready in seconds — on one screen.`
              }
            ]
          },
          {
            title: 'Why This Changes Everything',
            subsections: [
              {
                title: 'The Benefits of Streamlined Lead Generation',
                content: `One screen, zero chaos → Everything you need, in one place.

More confidence → Evecta updates in real time, so you always move before competitors.

More selling, less searching → Your energy goes where it should: talking to prospects.

Simplify Your Workflow → All your lead discovery happens in one clean dashboard.`
              }
            ]
          },
          {
            title: 'Final Word',
            subsections: [
              {
                title: 'From Chaos to Clarity',
                content: `Lead generation doesn't have to be chaos. It doesn't have to look like a messy browser with 15 tabs open and your energy drained before you even send your first email.

With Evecta, you go from manual chaos to AI-powered clarity. From 15 tabs to just 1 click.`
              }
            ]
          }
        ]
      }
    },
    {
      id: 'idea-to-income',
      title: 'From Idea to Income: How Founders turn passion into paying customers',
      author: 'Evecta Team',
      date: '5 Dec 2024',
      readTime: '9 minute read',
      category: 'Strategy',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format',
      featuredImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop&auto=format',
      excerpt: 'Every great business begins with an idea. It could be a product you wish existed, a service you know people need, or a skill you are passionate about sharing.',
      content: {
        introduction: `Every great business begins with an idea. It could be a product you wish existed, a service you know people need, or a skill you are passionate about sharing.

But here's the hard truth every founder learns quickly: an idea alone isn't enough. Turning passion into paying customers requires clarity, action, and the right tools.`,
        sections: [
          {
            title: 'Step 1: Validate the Idea',
            subsections: [
              {
                title: 'Testing Market Demand',
                content: `Before you spend months building, ask the simplest question: "Will anyone pay for this?"

Talk to potential customers.

Look for existing demand in your industry.

Identify the pain points your product or service actually solves.

The best founders do not chase what is trendy. They focus on solving real problems that people already feel.`
              }
            ]
          },
          {
            title: 'Step 2: Find the Right Audience',
            subsections: [
              {
                title: 'Connecting with Your Market',
                content: `Passion without an audience stays a hobby. To transform it into a business, you need to connect with the people who truly care.

This is where many founders get stuck. They search hours on Google, scroll through LinkedIn, or buy outdated lists. This is exactly where Evecta makes the difference. You type in your industry and Evecta does the rest. It finds the companies, enriches the data with details like size and location, and keeps it fresh in real time.

What used to take an entire day now takes minutes.`
              }
            ]
          },
          {
            title: 'Step 3: Build Trust Early',
            subsections: [
              {
                title: 'Establishing Credibility',
                content: `Customers do not buy from logos. They buy from people they trust.

Share your story and explain why you started.

Create content that helps before it sells.

Be human in your outreach. Personal connections always win over generic messages.

Trust is the bridge between a good idea and the first sale.`
              }
            ]
          },
          {
            title: 'Step 4: Focus on Quality Over Quantity',
            subsections: [
              {
                title: 'The Right Approach to Lead Generation',
                content: `Many founders believe they need thousands of leads to succeed. In reality, ten conversations with the right people are far more valuable than a thousand with the wrong ones.

With Evecta, lead discovery is built around quality. Instead of chasing numbers, you find accurate and enriched opportunities, updated in real time, so every outreach has meaning.`
              }
            ]
          },
          {
            title: 'Step 5: Turn Feedback Into Fuel',
            subsections: [
              {
                title: 'Learning from Your Customers',
                content: `Your first customers are more than buyers; they're teachers. Listen closely to what they say, how they use your product, and what frustrates them. That feedback is how you refine, improve, and scale.`
              }
            ]
          },
          {
            title: 'Final Thought',
            subsections: [
              {
                title: 'The Path to Success',
                content: `Ideas are everywhere. Passion is common. What sets successful founders apart is their ability to turn both into income.

They validate. They find their audience. They build trust. They focus on quality. They listen and adapt.

And they do not waste hours jumping between tabs to gather leads. That's what Evecta is built for helping founders like you turn passion into paying customers, faster and smarter.`
              }
            ]
          }
        ]
      }
    },
    {
      id: 'ai-differences',
      title: 'Why isn\'t all AI the same when it comes to finding the right leads?',
      author: 'Evecta Team',
      date: '3 Dec 2024',
      readTime: '10 minute read',
      category: 'Technology',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format',
      excerpt: 'Every SaaS tool today claims to use AI. But here is the question no one asks: Is all AI really the same when it comes to finding the right leads?',
      content: {
        introduction: `Every SaaS tool today claims to use AI. Scroll through LinkedIn or Google, and you will see it everywhere: "AI-powered lead generation," "AI-driven outreach," "AI for smarter sales."

And yes, the world already knows about big names like ChatGPT, Gemini, and many others. These are powerful technologies pushing AI forward.

But here is the question no one asks: Is all AI really the same when it comes to finding the right leads?

The answer is no. Because writing an email and discovering the right customer are not the same thing. And if you rely on the wrong kind of AI, you end up with noise instead of opportunities.`,
        sections: [
          {
            title: 'The Illusion of "AI"',
            subsections: [
              {
                title: 'Surface-Level AI vs. Real Intelligence',
                content: `Most tools slap "AI" on their marketing but use it for surface-level tasks.

Auto-completing your search query.

Guessing an email pattern.

Ranking leads based on simple rules.

That is not intelligence. That is automation with an AI sticker. It looks shiny but does not change how you actually discover customers.

Even the big names like ChatGPT or Gemini are built for conversation and content, not for industry-level lead discovery. They can help you write a cold email, but they will not tell you which company is hiring aggressively in your niche or which decision-maker just changed roles.`
              }
            ]
          },
          {
            title: 'The Problem With Shallow AI in Lead Gen',
            subsections: [
              {
                title: '1. It confuses volume with value',
                content: `These tools dump thousands of names into your CRM, but most of them will never buy. It is data overload dressed up as progress.`
              },
              {
                title: '2. It works only on what you already know',
                content: `If you search for "SaaS companies in New York," it will find exactly that, nothing more. You miss the hidden opportunities AI is supposed to uncover.`
              },
              {
                title: '3. It dies in real time',
                content: `The data goes stale the moment you export it. Roles change, companies pivot, funding happens, but your so-called "AI" never updates.`
              }
            ]
          },
          {
            title: 'What Real AI Looks Like',
            subsections: [
              {
                title: 'Signals, not just searches',
                content: `Real AI detects intent signals: funding rounds, hiring patterns, product launches. A lead that was cold yesterday might be hot today, and AI sees it before you do.`
              },
              {
                title: 'Context, not just contacts',
                content: `Real AI connects the dots. It does not just give you an email address. It tells you why this person, at this company, right now, is worth your time.`
              },
              {
                title: 'Living data, not dead lists',
                content: `Real AI keeps your data alive. Every lead is updated, enriched, and accurate. No more chasing ghosts.`
              },
              {
                title: 'Learning with you, not generic for everyone',
                content: `Real AI adapts to your wins and losses. It learns what your best customers look like, and refines results over time.`
              }
            ]
          },
          {
            title: 'This Is Why Evecta Exists',
            subsections: [
              {
                title: 'AI as an Advantage, Not a Buzzword',
                content: `At Evecta, we asked a simple question: Why settle for AI that only automates what is broken?

Instead of shallow searches, Evecta delivers industry-first discovery. Instead of stale spreadsheets, it gives you real-time enriched data. Instead of chasing volume, it helps you focus on quality. And instead of one-size-fits-all results, it evolves with you.

This is not AI as a buzzword. This is AI as an advantage. ChatGPT and Gemini can write the perfect email, but Evecta ensures you send it to the right person at the right time. Together, that is how ideas become income.`
              }
            ]
          },
          {
            title: 'Final Thought',
            subsections: [
              {
                title: 'The Right AI for the Right Job',
                content: `The truth is simple: not all AI is created equal. Some AI tools give you names. Others write you messages. The right AI gives you opportunities.

The question for every founder and sales team is this: Do you want more leads, or do you want the right leads?

If your answer is the right ones, then Evecta is where you start.`
              }
            ]
          }
        ]
      }
    }
  ];

  const categories = ['All', 'Strategy', 'Analytics', 'Technology', 'Marketing'];

  const filteredBlogs = selectedCategory === 'All' 
    ? blogData 
    : blogData.filter(blog => blog.category === selectedCategory);

  const displayedBlogs = filteredBlogs.slice(0, visibleBlogs);
  const hasMoreBlogs = visibleBlogs < filteredBlogs.length;


  // Initialize like counts for each blog
  React.useEffect(() => {
    const initialLikes = {};
    blogData.forEach(blog => {
      initialLikes[blog.id] = Math.floor(Math.random() * 50) + 10; // Random like count between 10-60
    });
    setBlogLikes(initialLikes);
  }, []);

  const handleBlogClick = (blogId) => {
    const blog = blogData.find(b => b.id === blogId);
    if (blog) {
      setSelectedBlog(blog);
    }
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVisibleBlogs(prev => prev + 8);
    setIsLoading(false);
  };

  const handleLike = (blogId, e) => {
    e.stopPropagation(); // Prevent triggering blog click
    
    const isLiked = likedBlogs.has(blogId);
    
    setLikedBlogs(prev => {
      const newLikedBlogs = new Set(prev);
      if (isLiked) {
        newLikedBlogs.delete(blogId);
      } else {
        newLikedBlogs.add(blogId);
      }
      return newLikedBlogs;
    });

    setBlogLikes(prev => ({
      ...prev,
      [blogId]: prev[blogId] + (isLiked ? -1 : 1)
    }));
  };



  return (
    <div className="blog-page">
      <div className="blog-container">
        {/* Blog Header */}
        <div className="blog-header">
          <div className="blog-logo">
            <div className="blog-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h1 className="blog-title">Blog</h1>
          </div>
          <div className="blog-filters">
            <button className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`} onClick={() => setSelectedCategory('All')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              Top
            </button>
            <div className="topics-dropdown">
              <button className={`filter-btn ${selectedCategory !== 'All' ? 'active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                Topics
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </button>
              <div className="dropdown-menu">
                {categories.filter(cat => cat !== 'All').map((category) => (
            <button
              key={category}
                    className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Articles with Alternating Layout */}
        <div className="blog-articles-container">
          {displayedBlogs.map((blog, index) => {
            const isFullWidth = index % 4 === 0; // Every 4th article (0, 4, 8, etc.) is full width
            const isFirstInRow = index % 4 === 1; // Articles 1, 5, 9, etc. start a new 3-column row
            
            if (isFullWidth) {
              // Full width article
              return (
            <motion.div
              key={blog.id}
                  className="featured-article"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleBlogClick(blog.id)}
            >
                  <div className="featured-content">
                    <div className="featured-text">
                      <h2 className="featured-title">{blog.title}</h2>
                      <div className="featured-meta">
                        <span className="featured-time">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                          Published {blog.date}
                        </span>
              </div>
                      <p className="featured-excerpt">{blog.excerpt}</p>
                      <div className="featured-footer">
                        <div className="featured-actions">
                          <button 
                            className={`action-btn like-btn ${likedBlogs.has(blog.id) ? 'liked' : ''}`}
                            onClick={(e) => handleLike(blog.id, e)}
                            title={likedBlogs.has(blog.id) ? 'Unlike' : 'Like'}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={likedBlogs.has(blog.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                          </button>
                          <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1"/>
                              <circle cx="19" cy="12" r="1"/>
                              <circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
                    </div>
                    <div className="featured-image">
                      <img src={blog.featuredImage} alt={blog.title} />
                    </div>
                  </div>
                </motion.div>
              );
            } else if (isFirstInRow) {
              // Start of 3-column row
              const rowBlogs = displayedBlogs.slice(index, index + 3);
              return (
                <motion.div 
                  key={`row-${index}`}
                  className="articles-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {rowBlogs.map((rowBlog, rowIndex) => (
                    <motion.div
                      key={rowBlog.id}
                      className="article-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (index + rowIndex) * 0.1 }}
                      whileHover={{ y: -2 }}
                      onClick={() => handleBlogClick(rowBlog.id)}
                    >
                      <div className="article-image">
                        <img src={rowBlog.featuredImage} alt={rowBlog.title} />
                      </div>
                      <div className="article-content">
                        <h3 className="article-title">{rowBlog.title}</h3>
                        <div className="article-footer">
                          <button 
                            className={`article-like-btn ${likedBlogs.has(rowBlog.id) ? 'liked' : ''}`}
                            onClick={(e) => handleLike(rowBlog.id, e)}
                            title={likedBlogs.has(rowBlog.id) ? 'Unlike' : 'Like'}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={likedBlogs.has(rowBlog.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
              );
            }
            return null; // Skip other articles as they're handled in the row above
          })}
        </div>

        {/* Load More Button */}
        {hasMoreBlogs && (
        <motion.div 
          className="blog-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button 
            className="load-more-btn"
              onClick={handleLoadMore}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <>
                  <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
            Load More Articles
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
                </>
              )}
          </motion.button>
        </motion.div>
        )}
      </div>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="blog-modal-overlay" onClick={closeBlogModal}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <button className="blog-modal-close" onClick={closeBlogModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="blog-modal-content">
              {/* Header */}
              <div className="blog-modal-header-content">
                <div className="blog-modal-header-top">
                  <span className="read-time">{selectedBlog.readTime}</span>
                </div>
                
                <h1 className="blog-modal-title">{selectedBlog.title}</h1>
                
                <div className="blog-modal-author-info">
                  <img src={selectedBlog.authorAvatar} alt={selectedBlog.author} className="blog-modal-author-avatar" />
                  <div className="blog-modal-author-details">
                    <span className="blog-modal-author-name">{selectedBlog.author}</span>
                    <span className="blog-modal-publish-date">{selectedBlog.date}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="blog-modal-featured-image">
                <img src={selectedBlog.featuredImage} alt={selectedBlog.title} />
              </div>

              {/* Introduction */}
              <div className="blog-modal-section">
                <h2 className="blog-modal-section-title">Introduction</h2>
                <div className="blog-modal-text">
                  {selectedBlog.content.introduction.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Main Sections */}
              {selectedBlog.content.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="blog-modal-section">
                  <h2 className="blog-modal-section-title">{section.title}</h2>
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="blog-modal-subsection">
                      <h3 className="blog-modal-subsection-title">{subsection.title}</h3>
                      <div className="blog-modal-text">
                        {subsection.content.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default BlogPage;
