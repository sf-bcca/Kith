import { FamilyService } from '../services/FamilyService';

console.log('--- Manual Verification of FamilyService ---\n');

// 1. Search Verification
console.log('1. Searching for "Merlin":');
const searchResults = FamilyService.search('Merlin');
searchResults.forEach(m => console.log(`   Found: ${m.firstName} ${m.lastName} (ID: ${m.id})`));
if (searchResults.length === 0) console.log('   No results found.');
console.log('\n');

// 2. Filter Verification
console.log('2. Filtering for Gender: "female" AND LastName: "Pendragon":');
const filterResults = FamilyService.filter({ gender: 'female', lastName: 'Pendragon' });
filterResults.forEach(m => console.log(`   Found: ${m.firstName} ${m.lastName} (Gender: ${m.gender})`));
if (filterResults.length === 0) console.log('   No results found.');
console.log('\n');

// 3. Filter Verification (Birth Year)
console.log('3. Filtering for Birth Year between 1960 and 1970:');
const yearResults = FamilyService.filter({ birthYearStart: 1960, birthYearEnd: 1970 });
yearResults.forEach(m => console.log(`   Found: ${m.firstName} ${m.lastName} (Born: ${m.birthDate})`));
if (yearResults.length === 0) console.log('   No results found.');
console.log('\n--------------------------------------------');
