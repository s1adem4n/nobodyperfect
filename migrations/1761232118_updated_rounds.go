package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_225224730")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation1355859462")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_225224730")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_3246635500",
			"hidden": false,
			"id": "relation1355859462",
			"maxSelect": 999,
			"minSelect": 0,
			"name": "answers",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
