import { Activity } from '../types/activity';

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'photo_added',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actorId: '2', // Uncle John
    targetId: '3', // Grandma Rose
    content: {
      photoUrls: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC43cinnWvwtZx1KdZEhJGqUEYE72rWAb7RhU_VbRuK7MGGQIwnZhvGn9aXCBpAumUUxifrWXkWwgxSV3CitTyWYY4gF6Vxaw8WpGkC9CTAJmlFh3_b4aCTWhnE7p5SdRfJOQiuNHoLiyOMyymedIIW6cUy-M9C8NApKOx-um73lhfj_-Yg4humKR_0qf4VgougudW_ECVtoepxHyUctHixk5nHvZru69TjVpRMjAaW-yLOnQ-X0d18Ax3kJMokq-yVtEoeqm3xCqw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDGNBaHFJGzsy2nIoxULp5YqfyaqswUfj2Bm1dVOGbPaeJClQWQe_M3mdsH9bsI7WeeUjbRvo0aI8CLTwuuLlX7EeQP-1MnKSix_74dJWZyM8AL0pfCduNic5-h9ekEpswlHdzFa2k0rlCbHd6YWzkJ_yDG8tiEso70WkeoPrrQkWvaBwIrd5CF6ulz5NPn2A0upp6f7QgSETaOWA5O83H-svV1gY8IExfBxYgNGIjd2eWVKzsYvEfyN9qj7u9pgNrvf0AJ2FaWP7M',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBPCpLDzYEoa5r89b1RVBLGKZ0Aw_4w8NzrW-YG4rx3b-DE3M9W1NFAAU5gXwTgGlFq6ca_oczWuWAa0cq8oFClDF8KI6B-eeB_PmxhAYoeHSh3CJPocO8qY2JHoAmq5y9nsGzldE31ULjMV1-7oP295A9PyngBLq6WxuheWlCeAVWHl0RpeX8VRiJ_9GKa99RHysBHuPplV_EyDUW7VWaeLHsWhPJ5-TKwRLlCHd_NGw5PDkwgdR_zSQSGs404lajFhBZtiS3yYq4'
      ],
      description: 'Found these in the attic today! Heritage collection from 1950s.'
    },
    status: 'pending',
    comments: []
  },
  {
    id: 'a2',
    type: 'member_updated',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    actorId: '4', // Sarah
    targetId: '5', // Leo Smith
    content: {
      field: 'birth date',
      oldValue: 'May 12, 1942',
      newValue: 'May 12, 1944'
    },
    status: 'pending',
    comments: []
  },
  {
    id: 'a3',
    type: 'member_added',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    actorId: '6', // Michael
    content: {
      memberDetails: {
        name: 'Clara Jane Thompson',
        birthDate: 'June 15, 2024',
        relationship: 'Daughter of Michael & Elena',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALlfWxJS82QzrLp81MZhx4K9EJVOZLP5UtI0DlOHHsFHMy0F2OdWqZ_DwfSAS6wVzfBtqp8ssLInOV8bV1pRVYvnvsFnWYu_TLVzeJeMFQ995esDz3BmeasBNE5FnydCr3Y-lzvxfWCBMl_MKWftVs87_1ZaZgYbUmp-O6hyvbF72v5DhLYTQf86wv8k5adBMKra1a2pAB9c2idIQL_WtPJNPsdr4JFL-CW7ZRNgw1HqHgDCybbWVxEqeS3its_RKeT4v3PWfF_sM'
      }
    },
    status: 'pending',
    comments: []
  }
];
