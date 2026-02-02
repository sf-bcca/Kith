import { TreeService } from '../services/TreeService';

console.log('--- Manual Verification of TreeService ---\n');

const treeData = TreeService.getTreeFor('7');

if (treeData) {
  console.log(`Focus Member: ${treeData.focus.firstName} ${treeData.focus.lastName}`);
  
  console.log('\nParents:');
  treeData.parents.forEach(p => console.log(` - ${p.firstName} ${p.lastName}`));
  
  console.log('\nSpouses:');
  treeData.spouses.forEach(s => console.log(` - ${s.firstName} ${s.lastName}`));
  
  console.log('\nChildren:');
  treeData.children.forEach(c => console.log(` - ${c.firstName} ${c.lastName}`));
} else {
  console.log('Error: Tree data for ID 7 not found.');
}

console.log('\n------------------------------------------');
