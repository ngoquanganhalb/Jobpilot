// const users = [{
//   name:"John",
//   age: 18
// },
//  {name: "Dave",
//  age:25}

// ]
// - Hãy lọc ra một array mới chứa các user có độ tuổi lớn hơn 20

// const filteredUsers = users.filter(i => i.age > 20);
// console.log(filteredUsers)

// - Hãy cho thêm 3 user mới vào trong array này và nằm ở phía đầu array
// const newUsers = [{
//   name:"A",
//   age:22
// },
// {name:'B',
//   age:23
// },
// {name:'C',
//   age:24
// }]

// const UpdateUsers = [...newUsers, ...users]
// console.log(UpdateUsers)

// - Hãy viết 1 function nhận vào 1 tên user và return ra user đó từ array trên, nếu không
// tìm được user nào thì return ra “User not found”

// function findUser(name) {
//   let notifi = "User not found";
//   users.map(user => {
//     if (user.name === name) {
//       notifi = user;
//     }
//   });
//   return notifi;
// } 
// console.log(findUser('Dave'))

// const obj1 = {name:"John"}
// const obj2 = obj1
// obj2 .name = "Helen"
// console.log(object1)
// console.log(object2)


// const car = {
//   brand: 'Honda',
//   price:5000,
//   getBranch: function () {
//     return this.brand;
//   },
//   getPrice:  () => this.price
  
// }
// console.log(car.getBranch())
// console.log(car.getPrice()) //undefined


// const bird = {
//   size:'small'
// }
// const mouse = {
//   name:'mickey',
//   small:true
// }

// console.log(mouse.bird.size) //undefined
// console.log(mouse[bird.size]) // true
// console.log(mouse[bird['size']]) //true

// const items = [
//   {name: "Laptop", price: 1000},
//   {name:"A", price: 1},
//   {name:'B', price:2}
// ]

// items.forEach((item, index) => {
//   return(
//     setTimeout(() => {
//       console.log(item.name)
//     }, index*1000)
//   )
// })

// const numbers = [1,20,15,5,6,8,5,20,25,20,7]

// const res = numbers
//   .filter((val, index, arr) => arr.indexOf(val) === index)
//   .sort((a, b) => a - b)
// console.log(res)

users: {
  [uid: string]: {
    name: string;
    email: string;
    username: string;
    avatarUrl?: string;
    accountType: 'candidate' | 'employer';
    savedJobs?: string[]; //job.id
    createdAt: timestamp
    profile?: {
      resumeUrl?: string;
      bio?: string;
      skills?: string[];
      location?: string;
      phone?: string;
    }
    companyProfile?: {
      name: string;
      description?: string;
      logoUrl?: string;
      website?: string;
      address?: string;
      industry?: string;
    }
  }
}


jobs: {
  [jobId: string]: {
    title: string;
    description: string;
    requirements: string[];
    salary: string;
    location: string;
    tags: string[]; 
    category: string;
    jobType: 'full-time' | 'part-time' | 'internship' | 'freelance';
    postedAt: timestamp;
    deadline: timestamp;
    employerId: string; // user.id
    applicants?: string[]; //candidate id
    status: 'open' | 'closed';
  }
}


applications: {
  [applicationId: string]: {
    jobId: string;
    candidateId: string;
    appliedAt: Timestamp;
    status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired';
    resumeUrl?: string;
    note?: string;
  }
}

savedJobs: {
  [docId: string]: {
    userId: string;
    jobId: string;
    savedAt: timestamp;
  }
}
