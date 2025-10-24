// main.go
package main

import (
	"io/fs"
	"log"

	"nobodyperfect/frontend"
	_ "nobodyperfect/migrations"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: app.IsDev(),
	})

	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		subFS, err := fs.Sub(frontend.FS, "build")
		if err != nil {
			return err
		}
		e.Router.GET("/{path...}", apis.Static(subFS, true))

		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
