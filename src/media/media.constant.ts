export abstract class MediaConstants {
    static get StandardIncludeSets() {
      return _StandardMediaIncludeSets;
    }
  }
  
  abstract class _StandardMediaIncludeSets {
    // Use type Prisma.PostInclude for reference when adding/updating these values
    // But don't assign a return type since that will make it lose type safety
  
    static get media() {
      return {
        url: true,
      };
    }

    
  }
  