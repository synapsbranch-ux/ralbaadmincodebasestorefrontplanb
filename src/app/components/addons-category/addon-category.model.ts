export class AddonsCategory {
    _id: string;
    add_ons_json_name: string;
    addons: any
    attributes: any
    child_categories: any
    attributes_json_name: string;
    category_image: string;
    category_image_name: string;
    category_name: string;
    category_slug: string;
    status: string;

    constructor(addonscategoory) {
        this._id = addonscategoory._id;
        this.add_ons_json_name = addonscategoory.add_ons_json_name;
        this.addons = addonscategoory.addons;
        this.attributes = addonscategoory.attributes;
        this.child_categories = addonscategoory.child_categories;
        this.attributes_json_name = addonscategoory.attributes_json_name;
        this.category_image = addonscategoory.category_image;
        this.category_image_name = addonscategoory.category_image_name;
        this.category_name = addonscategoory.category_name;
        this.category_slug = addonscategoory.category_slug;
        this.status = addonscategoory.status;
    }

}

