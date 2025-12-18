// main.go
package main

import (
	"io/fs"
	"log"
	"strings"
	"time"

	"nobodyperfect/frontend"
	_ "nobodyperfect/migrations"

	"github.com/pocketbase/dbx"
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

	app.OnRecordCreate("games").BindFunc(func(e *core.RecordEvent) error {
		code, err := generateCode(6)
		if err != nil {
			return err
		}
		e.Record.Set("code", code)

		return e.Next()
	})

	app.Cron().MustAdd("clean_games", "0 * * * *", func() {
		cutoff := time.Now().UTC().Add(-4 * time.Hour)
		games, err := app.FindRecordsByFilter(
			"games",
			"created < {:cutoff}",
			"", 0, 0,
			dbx.Params{
				"cutoff": cutoff,
			},
		)
		if err != nil {
			app.Logger().Error("failed to find old games", "error", err)
		}

		for _, game := range games {
			err = app.Delete(game)
			if err != nil {
				app.Logger().Error("failed to delete game", "error", err)
				return
			}
		}
	})

	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		e.Router.Bind(apis.Gzip())
		e.Router.BindFunc(func(e *core.RequestEvent) error {
			if strings.HasPrefix(e.Request.URL.Path, "/assets") {
				e.Response.Header().Set("Cache-Control", "public, max-age=31536000")
			}

			return e.Next()
		})

		subFS, err := fs.Sub(frontend.FS, "dist")
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
