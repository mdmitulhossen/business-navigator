import PicGreen from '@/assets/green.jpg';
import picNeom from '@/assets/Neom.jpg';
import picQiddiya from '@/assets/Qiddiya.jpg';
import picRedSea from '@/assets/red-sea.jpg';
import PicROSHN from '@/assets/ROSHN.jpg';
import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building, Calendar, Leaf, MapPin, Trophy, Users } from 'lucide-react';


const ExploreSaudi = () => {
  // Vision 2030 Pillars Data
  const visionPillars = [
    {
      title: "Thriving Economy",
      description: "Diversifying the economy and creating jobs for Saudi citizens",
      icon: <Building className="w-8 h-8" />,
      color: "bg-blue-500"
    },
    {
      title: "Vibrant Society",
      description: "A society where all citizens can fulfill their dreams and ambitions",
      icon: <Users className="w-8 h-8" />,
      color: "bg-green-500"
    },
    {
      title: "Ambitious Nation",
      description: "An effective government enabling citizens and businesses to thrive",
      icon: <Trophy className="w-8 h-8" />,
      color: "bg-purple-500"
    }
  ];

  // Key Initiatives
  const keyInitiatives = [
    {
      title: "NEOM",
      description: "A $500 billion mega-city powered by renewable energy",
      image: picNeom,
      category: "Smart Cities"
    },
    {
      title: "Red Sea Project",
      description: "Luxury tourism destination with pristine beaches and coral reefs",
      image: picRedSea,
      category: "Tourism"
    },
    {
      title: "Qiddiya",
      description: "The capital of entertainment, sports and arts in Saudi Arabia",
      image: picQiddiya,
      category: "Entertainment"
    },
    {
      title: "ROSHN",
      description: "Creating vibrant communities for quality living",
      image: PicROSHN,
      category: "Housing"
    }
  ];

  // Success Stories
  const successStories = [
    {
      title: "Saudi Arabia Joins G20 Tourism Ministers' Meeting",
      excerpt: "Leading discussions on sustainable tourism development...",
      date: "Jan 20, 2026",
      category: "Tourism",
      readTime: "3 min read"
    },
    {
      title: "Green Saudi Initiative Plants 50 Million Trees",
      excerpt: "Major milestone in environmental transformation...",
      date: "Jan 18, 2026",
      category: "Environment",
      readTime: "4 min read"
    },
    {
      title: "Saudi Women's Participation Reaches Record High",
      excerpt: "Female workforce participation exceeds 35%...",
      date: "Jan 15, 2026",
      category: "Society",
      readTime: "5 min read"
    }
  ];

  // Statistics
  const statistics = [
    { label: "Job Creation Target", value: "2.65M", suffix: "Jobs" },
    { label: "Non-Oil Revenue", value: "50%", suffix: "by 2030" },
    { label: "Female Workforce", value: "30%", suffix: "Target" },
    { label: "Renewable Energy", value: "50%", suffix: "Target" }
  ];

  return (
    <Layout>
      <PageHero 
        title="Explore Saudi Vision 2030"
        subtitle="Discover the transformation journey of the Kingdom"
        // backgroundImage="/api/placeholder/1920/600"
      />

      {/* Vision 2030 Pillars */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Three Pillars of Vision 2030
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Saudi Vision 2030 is built upon three fundamental pillars that guide the Kingdom's transformation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {visionPillars.map((pillar, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className={`${pillar.color} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {pillar.icon}
                  </div>
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {pillar.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Flagship Projects & Initiatives
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Groundbreaking projects that are reshaping Saudi Arabia's future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyInitiatives.map((initiative, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={initiative.image} 
                    alt={initiative.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{initiative.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{initiative.title}</CardTitle>
                  <CardDescription>{initiative.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vision 2030 Targets
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Ambitious goals driving the Kingdom's transformation
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base opacity-80">
                  {stat.suffix}
                </div>
                <div className="text-sm md:text-base font-medium mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Success Stories
              </h2>
              <p className="text-lg text-gray-600">
                Real progress, real impact, real transformation
              </p>
            </div>
            <Button className="mt-4 md:mt-0">
              View All Stories <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{story.category}</Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {story.date}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-green-600 transition-colors">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {story.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    {story.readTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability & Environment */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="w-8 h-8 text-green-600 mr-3" />
                <Badge variant="outline" className="text-green-600">Sustainability</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Green Saudi Initiative
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Saudi Arabia is committed to becoming a leader in environmental sustainability, 
                with ambitious plans to plant billions of trees and generate 50% of energy from renewables by 2030.
              </p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  10 billion trees to be planted across the Kingdom
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  50% renewable energy target by 2030
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Net-zero emissions by 2060
                </li>
              </ul>
              <Button size="lg">
                Learn More About Sustainability
              </Button>
            </div>
            <div className="relative">
              <img 
                src={PicGreen}
                alt="Green Saudi Initiative" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Heritage */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preserving Our Heritage
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              While building the future, we honor our rich cultural heritage and traditions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>UNESCO World Heritage Sites</CardTitle>
                <CardDescription>
                  Preserving historical sites like Al-Hijr, At-Turaif, and Rock Art in Hail Region
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Cultural Programs</CardTitle>
                <CardDescription>
                  Supporting arts, literature, and cultural events that celebrate Saudi identity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Traditional Architecture</CardTitle>
                <CardDescription>
                  Restoring and maintaining traditional Saudi architectural heritage
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Be Part of the Vision
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join millions of Saudis and residents in building a prosperous, sustainable, and vibrant future
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Explore Opportunities
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600">
              Download Vision 2030 Report
            </Button>
          </div> */}
        </div>
      </section>
    </Layout>
  );
};

export default ExploreSaudi;