package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3246635500")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_225224730",
			"hidden": false,
			"id": "relation3320769076",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "round",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3246635500")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation3320769076")

		return app.Save(collection)
	})
}
