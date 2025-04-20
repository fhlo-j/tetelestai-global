
import { Leader } from "../models/Leader";

export const leaders: Leader[] = [
  {
    id: "emmanuel-johnson",
    name: "Pastor Emmanuel Johnson",
    role: "Senior Pastor & Founder",
    bio: "With over 20 years in ministry, Pastor Emmanuel leads with vision and compassion, committed to seeing lives transformed through God's Word. He founded Tetelestai Global Ministry in 2010 after receiving a clear call from God to establish a ministry focused on the finished work of Christ. His powerful teaching and prophetic insight have touched thousands of lives across multiple nations. Pastor Emmanuel is known for his ability to communicate complex biblical truths with clarity and practical application.",
    email: "pastor.emmanuel@tetelestai.org",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250",
    socialMedia: {
      facebook: "https://facebook.com/pastoremmanueljohnson",
      twitter: "https://twitter.com/pastoremmanuel",
      instagram: "https://instagram.com/pastoremmanueljohnson"
    },
    isSeniorPastor: true,
    orderRank: 1,
    education: [
      "Doctor of Divinity, Faith Theological Seminary",
      "Masters in Biblical Studies, Covenant Seminary",
      "Bachelor of Arts in Theology, Grace Bible College"
    ],
    ministryFocus: [
      "Biblical Teaching & Preaching",
      "Leadership Development",
      "Global Missions",
      "Church Planting"
    ],
    familyInfo: "Pastor Emmanuel is happily married to Sarah Johnson for 25 years. They have three children who are also active in ministry.",
    visionStatement: "To see a church without walls, reaching the unreached and discipling nations with the profound truth of Christ's finished work."
  },
  {
    id: "sarah-williams",
    name: "Sarah Williams",
    role: "Worship Director",
    bio: "Sarah's anointed leadership in worship creates an atmosphere where people can encounter God's presence and experience spiritual renewal. With a background in music education and over 15 years of worship leadership experience, she has developed a worship ministry that is both excellent in skill and deeply spiritual in focus. Sarah is passionate about raising up the next generation of worship leaders and sees worship as a powerful tool for transformation.",
    email: "sarah.williams@tetelestai.org",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250",
    socialMedia: {
      instagram: "https://instagram.com/sarahworship"
    },
    orderRank: 2,
    education: [
      "Bachelor of Music, Julliard School of Music",
      "Worship Leadership Certification, Hillsong College"
    ],
    ministryFocus: [
      "Worship Leadership",
      "Songwriting & Music Production",
      "Training & Developing Worship Teams",
      "Creating Worship Resources"
    ]
  },
  {
    id: "david-thompson",
    name: "Elder David Thompson",
    role: "Outreach Coordinator",
    bio: "David oversees our community outreach programs with a passion for extending God's love beyond the church walls to those in need. He has pioneered several humanitarian initiatives that have impacted thousands of lives in underserved communities. His background in social work combined with his deep faith makes him especially effective in mobilizing teams to meet both spiritual and practical needs in our community.",
    email: "david.thompson@tetelestai.org",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250",
    socialMedia: {
      facebook: "https://facebook.com/elderdavid",
      twitter: "https://twitter.com/davethompson"
    },
    orderRank: 3,
    ministryFocus: [
      "Community Outreach",
      "Humanitarian Aid",
      "Social Justice Initiatives",
      "Evangelistic Campaigns"
    ],
    familyInfo: "David and his wife Rachel have been married for 12 years. They have four children and are also foster parents."
  },
  {
    id: "rebecca-jackson",
    name: "Rebecca Jackson",
    role: "Youth Pastor",
    bio: "Rebecca leads our vibrant youth ministry with energy, creativity and a deep love for young people. Her innovative approach to youth ministry combines biblical teaching with relevant cultural engagement, helping teens and young adults navigate today's challenges while staying grounded in their faith.",
    email: "rebecca.jackson@tetelestai.org",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250",
    orderRank: 4,
    education: [
      "Master of Divinity with Youth Ministry Focus, Fuller Seminary",
      "Bachelor of Arts in Psychology, State University"
    ],
    ministryFocus: [
      "Youth Discipleship",
      "Mentoring Programs",
      "Campus Ministry Outreach",
      "Youth Leadership Development"
    ]
  },
  {
    id: "michael-roberts",
    name: "Michael Roberts",
    role: "Assistant Pastor",
    bio: "Pastor Michael serves as right-hand to our Senior Pastor, overseeing daily church operations and providing pastoral care to our congregation. His administrative gifts and pastoral heart work together to ensure that ministry programs run smoothly while people's spiritual needs are met with compassion.",
    email: "michael.roberts@tetelestai.org",
    phone: "+1 (555) 987-6543",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250",
    socialMedia: {
      facebook: "https://facebook.com/pastormichaelroberts",
      linkedin: "https://linkedin.com/in/pastormichaelroberts"
    },
    orderRank: 2,
    education: [
      "Master of Divinity, Asbury Theological Seminary",
      "Bachelor of Theology, Liberty University"
    ],
    ministryFocus: [
      "Pastoral Care",
      "Church Administration",
      "Small Group Development",
      "Men's Ministry"
    ],
    familyInfo: "Michael is married to Jennifer, and they have two teenage daughters who are active in the youth ministry."
  }
];
