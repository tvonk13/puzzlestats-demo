import { generateStats } from './Utils/util';

var user = {
    username: "bob",
    email: "bob@bob.com",
    nytEmail: "test@test.com",
    nytPassword: "test",
    isNytLinked: true,
}

var stats = generateStats();

export { stats, user };