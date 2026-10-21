// src/mappers/product-mapper.js
export default class ProductMapper {
    // แปลงเป็น Less Data DTO (Summary)
    static toSummaryDTO(entity) {
        return {
            id: entity.id,
            sku: entity.sku,
            name: entity.name,
            brandId: entity.brandId,
            category: entity.category,
            price: entity.price,
            status: entity.status
        };
    }

    // แปลงเป็น Full Data DTO
    static toDetailDTO(entity) {
        const {MSRP,buyPrice, ...data} = entity
        data.retailPrice = MSRP
        data.price = buyPrice
        return data
    }

    static map(entity, viewType) {
        if(viewType == 'summary') {
            return this.toSummaryDTO(entity)
        } else {
            return this.toDetailDTO(entity)
        }
    }
    static maps(entities, viewType) {
        const {totalItems} = entities
        let entitiesMap = {}
        if(viewType == 'full') {
            entitiesMap = entities.map(item => this.toDetailDTO(item))
        } else {
            entitiesMap = entities.map(item => this.toSummaryDTO(item))
        }
        if(totalItems) {
            entitiesMap.totalItems = totalItems
        }
        return entitiesMap
    }
}