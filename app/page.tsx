"use client";

import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock,
  LineChart,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 via-background to-amber-50/30 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/10" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.015] dark:opacity-[0.025] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {/* Navigation */}
      <nav className="relative border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-2xl font-bold tracking-tight ${playfair.className}`}
              >
                JobDash
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Track smarter, land faster
              </div>

              <h1
                className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] ${playfair.className}`}
              >
                Turn Job Rejections into{" "}
                <span className="bg-linear-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Success Stories
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Stop losing track of applications. Start learning from every
                interview. JobDash helps you organize your job search and
                transform setbacks into your competitive advantage.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-in"
                  className="group px-8 py-4 bg-linear-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  Start Tracking Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  type="button"
                  className="px-8 py-4 bg-background border-2 border-border hover:border-foreground/20 rounded-xl font-semibold text-lg transition-all hover:scale-105"
                >
                  Watch Demo
                </button>
              </div>

              {/* Social proof with avatars */}
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[
                      "bg-emerald-500",
                      "bg-blue-500",
                      "bg-amber-500",
                      "bg-purple-500",
                      "bg-pink-500",
                    ].map((color, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full ${color} border-2 border-background flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">
                      Join 12,500+ job seekers
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span>4.9/5 from 1,200+ reviews</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-muted-foreground">
                      No credit card required
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-muted-foreground">
                      Bank-level encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-muted-foreground">
                      Setup in 60 seconds
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Your Dashboard
                      </h3>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      </div>
                    </div>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Applications",
                          value: "24",
                          icon: Target,
                          color: "emerald",
                        },
                        {
                          label: "Interviews",
                          value: "8",
                          icon: TrendingUp,
                          color: "amber",
                        },
                        {
                          label: "Offers",
                          value: "2",
                          icon: Award,
                          color: "blue",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-background rounded-lg p-3 border border-border"
                        >
                          <stat.icon
                            className={`w-4 h-4 text-${stat.color}-600 mb-1`}
                          />
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mini chart */}
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <LineChart className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Application Trend
                        </span>
                      </div>
                      <div className="flex items-end gap-2 h-24">
                        {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-linear-to-t from-emerald-500 to-emerald-400 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-linear-to-b from-background to-slate-50/50 dark:to-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: 12500, suffix: "+" },
              { label: "Jobs Tracked", value: 45000, suffix: "+" },
              { label: "Success Rate", value: 73, suffix: "%" },
              { label: "Avg. Time Saved", value: 15, suffix: "hrs/mo" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center space-y-2"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`text-4xl md:text-5xl font-black ${playfair.className} text-foreground`}
                >
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">
                <Target className="w-4 h-4" />
                The Problem
              </div>
              <h2
                className={`text-4xl md:text-5xl font-black ${playfair.className}`}
              >
                Job hunting is{" "}
                <span className="bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  overwhelming
                </span>
              </h2>
              <div className="space-y-4">
                {[
                  "Losing track of which jobs you've applied to",
                  "Forgetting to follow up on promising opportunities",
                  "No clear view of what's working in your strategy",
                  "Missing deadlines and interview dates",
                  "Feeling discouraged without seeing progress",
                ].map((problem, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    </div>
                    <p className="text-lg text-muted-foreground">{problem}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                The Solution
              </div>
              <h2
                className={`text-4xl md:text-5xl font-black ${playfair.className}`}
              >
                JobDash keeps you{" "}
                <span className="bg-linear-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  organized & motivated
                </span>
              </h2>
              <div className="space-y-4">
                {[
                  "Every application tracked in one centralized dashboard",
                  "Automated reminders ensure you never miss a follow-up",
                  "Analytics reveal what's working so you can improve",
                  "Calendar integration keeps all dates organized",
                  "Visual progress tracking celebrates every win",
                ].map((solution, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-lg text-muted-foreground">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2
              className={`text-4xl md:text-5xl font-black ${playfair.className}`}
            >
              Everything you need to{" "}
              <span className="bg-linear-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                land your dream job
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to keep you organized, motivated, and
              always improving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Application Tracking",
                description:
                  "Keep every application organized with status updates, deadlines, and custom tags.",
                color: "emerald",
              },
              {
                icon: BarChart3,
                title: "Analytics & Insights",
                description:
                  "Visualize your job search journey with actionable metrics and success patterns.",
                color: "blue",
              },
              {
                icon: TrendingUp,
                title: "Progress Timeline",
                description:
                  "Track every step from application to offer with an intuitive visual timeline.",
                color: "amber",
              },
              {
                icon: Zap,
                title: "Smart Reminders",
                description:
                  "Never miss a follow-up or deadline with intelligent automated reminders.",
                color: "purple",
              },
              {
                icon: LineChart,
                title: "Interview Feedback",
                description:
                  "Document and learn from every interview to continuously improve your performance.",
                color: "pink",
              },
              {
                icon: Award,
                title: "Success Tracking",
                description:
                  "Celebrate wins and identify what's working with comprehensive success metrics.",
                color: "cyan",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl border border-border bg-card hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br from-${feature.color}-500/10 to-${feature.color}-500/5 border border-${feature.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      className={`w-6 h-6 text-${feature.color}-600`}
                    />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2
              className={`text-4xl md:text-5xl font-black ${playfair.className}`}
            >
              How JobDash{" "}
              <span className="bg-linear-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                works for you
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and take control of your job search journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Target,
                title: "Add Applications",
                description:
                  "Quickly log every job you apply to with key details like company, position, salary range, and application date.",
              },
              {
                step: "02",
                icon: TrendingUp,
                title: "Track Progress",
                description:
                  "Update status as you move through stages: Applied, Screening, Interview, Offer, or Rejected. Never lose track again.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Analyze & Improve",
                description:
                  "Review insights on response rates, interview performance, and successful patterns to refine your strategy.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="relative"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-xl" />
                    <div className="relative w-20 h-20 mx-auto bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-emerald-600">
                      STEP {item.step}
                    </div>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-linear-to-r from-emerald-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2
              className={`text-4xl md:text-5xl font-black ${playfair.className}`}
            >
              Loved by{" "}
              <span className="bg-linear-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                job seekers everywhere
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience with JobDash
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer",
                company: "Tech Corp",
                image: "SJ",
                content:
                  "JobDash completely transformed my job search. I went from feeling overwhelmed by dozens of applications to having a clear, organized system. Landed my dream job in 6 weeks!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Product Manager",
                company: "StartupXYZ",
                image: "MC",
                content:
                  "The analytics feature is a game-changer. I could see exactly which types of applications were getting responses and adjusted my strategy accordingly. Highly recommend!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "UX Designer",
                company: "Design Studio",
                image: "ER",
                content:
                  "As someone who applied to over 100 positions, JobDash was essential. The reminder system meant I never missed a follow-up, and the timeline view kept me motivated.",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={testimonial.name}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2
              className={`text-4xl md:text-5xl font-black ${playfair.className}`}
            >
              Frequently asked{" "}
              <span className="bg-linear-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about JobDash
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Is JobDash really free?",
                answer:
                  "Yes! JobDash is completely free to use with no hidden costs. We believe everyone deserves access to tools that help them succeed in their job search.",
              },
              {
                question: "How secure is my data?",
                answer:
                  "We take security seriously. All your data is encrypted and stored securely. We never share your information with third parties, and you can export or delete your data at any time.",
              },
              {
                question: "Can I track applications from different job boards?",
                answer:
                  "Absolutely! JobDash works with any job board or application method. Whether you're applying through LinkedIn, Indeed, company websites, or email, you can track it all in one place.",
              },
              {
                question: "What happens if I apply to hundreds of jobs?",
                answer:
                  "JobDash is built to scale with you. Whether you're tracking 10 or 1000 applications, our system handles it smoothly with powerful search, filtering, and analytics features.",
              },
              {
                question: "Do I need to install anything?",
                answer:
                  "No installation needed! JobDash is a web application that works directly in your browser. Access it from any device, anywhere, anytime.",
              },
              {
                question: "Can I get reminders for follow-ups?",
                answer:
                  "Yes! JobDash includes smart reminder features to help you follow up at the right time and never miss important deadlines or interview dates.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-emerald-500/50 transition-all duration-300"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-linear-to-br from-emerald-600 to-emerald-500 p-12 md:p-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800/20 rounded-full blur-3xl" />

            <div className="relative text-center space-y-6">
              <h2
                className={`text-4xl md:text-5xl font-black text-white ${playfair.className}`}
              >
                Ready to transform your job search?
              </h2>
              <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
                Join thousands of job seekers who've taken control of their
                career journey with JobDash.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/sign-in"
                  className="group px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <p className="text-sm text-emerald-100">
                Free forever. No credit card required. Start tracking in under
                60 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold ${playfair.className}`}>
              JobDash
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 JobDash. Helping you land your dream job, one application at
            a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
